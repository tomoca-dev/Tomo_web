# Telegram Bot (Webhook) – @Tomocashopbot

This folder contains the production Telegram bot server (Express + Telegraf) that:
- reads **products** from Supabase
- creates **orders** and **order_items** in Supabase
- runs in **Webhook mode** (recommended for production)

## Environment variables
Copy `.env.example` to `.env` (local) or set these in Render:
- `BOT_TOKEN`
- `BOT_USERNAME` (optional, default `Tomocashopbot`)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (**server only**)
- `PUBLIC_BASE_URL` (your Render URL, e.g. `https://tomoca-bot.onrender.com`)
- `WEBHOOK_SECRET` (random string)
- `PORT` (Render provides `PORT` automatically)
- `ADMIN_CHAT_ID` (optional; send new order notifications to this chat)

## Local run
Webhook needs a public HTTPS URL. For local testing use a tunnel (ngrok/cloudflared).

```bash
npm install
npm start
```

## Render deploy (recommended)
1. Create a new **Web Service**
2. Set **Root Directory** to `server/telegram-bot`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add the environment variables above

After deploy, the server calls `setWebhook()` automatically.

## Website deep-link
The website should open:
- `https://t.me/Tomocashopbot?start=product_<productId>`

The bot will show that product and let the user order.
