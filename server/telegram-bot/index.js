import 'dotenv/config';
import express from 'express';
import { Telegraf, Markup } from 'telegraf';
import { createClient } from '@supabase/supabase-js';

const {
  BOT_TOKEN,
  BOT_USERNAME,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  PUBLIC_BASE_URL,
  WEBHOOK_SECRET,
  PORT,
  ADMIN_CHAT_ID,
} = process.env;

function required(name, value) {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

required('BOT_TOKEN', BOT_TOKEN);
required('SUPABASE_URL', SUPABASE_URL);
required('SUPABASE_SERVICE_ROLE_KEY', SUPABASE_SERVICE_ROLE_KEY);
required('PUBLIC_BASE_URL', PUBLIC_BASE_URL);
required('WEBHOOK_SECRET', WEBHOOK_SECRET);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const bot = new Telegraf(BOT_TOKEN);

// ---------- Helpers ----------
const botUsername = (BOT_USERNAME || 'Tomocashopbot').replace(/^@/, '');

async function fetchActiveProductsByCategory(category) {
  const { data, error } = await supabase
    .from('products')
    .select('id,name,price,image_url,description,category,is_active')
    .eq('is_active', true)
    .eq('category', category)
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

async function fetchActiveProductById(productId) {
  const { data, error } = await supabase
    .from('products')
    .select('id,name,price,image_url,description,category,is_active')
    .eq('id', productId)
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data;
}

async function createOrder({ telegramUserId, product }) {
  const { data: order, error: oErr } = await supabase
    .from('orders')
    .insert([{ telegram_user_id: telegramUserId, status: 'new' }])
    .select('*')
    .single();
  if (oErr) throw oErr;

  const { error: iErr } = await supabase.from('order_items').insert([
    {
      order_id: order.id,
      product_id: product.id,
      qty: 1,
      price: product.price,
    },
  ]);
  if (iErr) throw iErr;

  return order;
}

function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🛍️ Shop', 'SHOP')],
    [Markup.button.callback('ℹ️ Help', 'HELP')],
  ]);
}

function categoriesMenu() {
  // Uses your DB category values from earlier SQL: coffee/accessories/other
  return Markup.inlineKeyboard([
    [Markup.button.callback('☕ Coffee', 'CAT_coffee')],
    [Markup.button.callback('🎁 Accessories', 'CAT_accessories')],
    [Markup.button.callback('🧁 Other', 'CAT_other')],
  ]);
}

// ---------- Bot logic ----------
bot.start(async (ctx) => {
  const payload = (ctx.startPayload || '').trim();

  // Deep link support: https://t.me/<bot>?start=product_<uuid>
  if (payload.startsWith('product_')) {
    const productId = payload.replace('product_', '');
    const product = await fetchActiveProductById(productId);
    if (!product) {
      await ctx.reply('Sorry, that product was not found or is not active.', mainMenu());
      return;
    }

    const text = `*${product.name}*\nPrice: ${product.price}\n\n${product.description ?? ''}`;
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('✅ Order', `ORDER_${product.id}`)],
      [Markup.button.callback('⬅️ Back to Shop', 'SHOP')],
    ]);

    if (product.image_url) {
      await ctx.replyWithPhoto(product.image_url, { caption: product.name });
    }
    await ctx.replyWithMarkdown(text, keyboard);
    return;
  }

  await ctx.reply('Welcome ☕\nChoose an option:', mainMenu());
});

bot.command('shop', async (ctx) => {
  await ctx.reply('Choose a category:', categoriesMenu());
});

bot.command('help', async (ctx) => {
  await ctx.reply('Use /shop to browse products and place an order.');
});

bot.action('HELP', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Use Shop to browse products and place an order.');
});

bot.action('SHOP', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Choose a category:', categoriesMenu());
});

bot.action(/CAT_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const category = ctx.match[1];

  let products = [];
  try {
    products = await fetchActiveProductsByCategory(category);
  } catch (e) {
    await ctx.reply('Error loading products. Please try again.');
    return;
  }

  if (!products.length) {
    await ctx.reply('No products found in this category.', categoriesMenu());
    return;
  }

  const buttons = products.map((p) => [
    Markup.button.callback(`${p.name} - ${p.price}`, `PROD_${p.id}`),
  ]);

  await ctx.reply(`Products in ${category}:`, Markup.inlineKeyboard(buttons));
});

bot.action(/PROD_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const productId = ctx.match[1];

  const product = await fetchActiveProductById(productId);
  if (!product) {
    await ctx.reply('Product not found.', categoriesMenu());
    return;
  }

  const text = `*${product.name}*\nPrice: ${product.price}\n\n${product.description ?? ''}`;
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('✅ Order', `ORDER_${product.id}`)],
    [Markup.button.callback('⬅️ Back', 'SHOP')],
  ]);

  if (product.image_url) {
    await ctx.replyWithPhoto(product.image_url, { caption: product.name });
  }
  await ctx.replyWithMarkdown(text, keyboard);
});

bot.action(/ORDER_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const productId = ctx.match[1];
  const telegramUserId = String(ctx.from.id);

  const product = await fetchActiveProductById(productId);
  if (!product) {
    await ctx.reply('Product not found.', categoriesMenu());
    return;
  }

  let order;
  try {
    order = await createOrder({ telegramUserId, product });
  } catch (e) {
    await ctx.reply('Could not create order. Please try again.');
    return;
  }

  await ctx.reply(
    `✅ Order created!\nItem: ${product.name}\nQty: 1\n\nNext: send your phone number.`,
    Markup.keyboard([Markup.button.contactRequest('📞 Share phone number')]).oneTime().resize()
  );

  if (ADMIN_CHAT_ID) {
    await bot.telegram.sendMessage(
      ADMIN_CHAT_ID,
      `🧾 New Order\nOrder ID: ${order.id}\nUser: ${telegramUserId}\nProduct: ${product.name}\nPrice: ${product.price}`
    );
  }
});

bot.on('contact', async (ctx) => {
  const telegramUserId = String(ctx.from.id);
  const phone = ctx.message.contact.phone_number;

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('telegram_user_id', telegramUserId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!order) {
    await ctx.reply('No active order found. Use Shop to start a new order.', mainMenu());
    return;
  }

  await supabase.from('orders').update({ phone, status: 'confirmed' }).eq('id', order.id);

  await ctx.reply('✅ Phone saved. Now type your delivery address (or type: pickup).', Markup.removeKeyboard());
});

bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  if (text.startsWith('/')) return;

  const telegramUserId = String(ctx.from.id);

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('telegram_user_id', telegramUserId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!order) return;

  await supabase.from('orders').update({ address: text }).eq('id', order.id);
  await ctx.reply('🎉 Address saved! We’ll contact you soon.', mainMenu());
});

// ---------- Webhook server ----------
const app = express();
app.use(express.json());

app.get('/', (_req, res) => res.status(200).send('OK'));

app.post(`/webhook/${WEBHOOK_SECRET}`, (req, res) => {
  bot.handleUpdate(req.body, res);
});

app.listen(Number(PORT) || 3000, async () => {
  const webhookUrl = `${PUBLIC_BASE_URL.replace(/\/$/, '')}/webhook/${WEBHOOK_SECRET}`;
  await bot.telegram.setWebhook(webhookUrl);
  console.log(`Bot @${botUsername} webhook set to: ${webhookUrl}`);
  console.log(`Server running on port ${PORT || 3000}`);
});
