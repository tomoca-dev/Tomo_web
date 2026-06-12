import { supabase } from '@/integrations/supabase/client';

const productFallback = [
  {
    id: 'fallback-espresso',
    name: 'TOMOCA Espresso Blend',
    origin: 'Ethiopia',
    roast_level: 'Medium',
    roast_profile: 'Chocolate, citrus, gentle spice',
    description: 'A balanced Ethiopian espresso blend inspired by Tomoca’s Addis Ababa heritage.',
    image_url: 'https://media.base44.com/images/public/user_69df9e9a9deb3a1ce37f2911/cc868889c_TOMOCAAngledStandingPouch.jpg',
    weight: '250g',
    price_usd: 18,
    available: true,
    category: 'coffee',
  },
];

function mapProduct(p) {
  return {
    ...p,
    image_url: p.image_url || p.image || productFallback[0].image_url,
    image: p.image_url || p.image || productFallback[0].image_url,
    price_usd: p.price_usd ?? p.price ?? 0,
    price: p.price ?? p.price_usd ?? 0,
    weight: p.weight || (p.weight_grams ? `${p.weight_grams}g` : ''),
    roast_profile: p.roast_profile || p.description || p.notes || '',
    notes: p.notes || p.description || p.roast_profile || '',
    available: p.available ?? p.is_available ?? true,
    is_available: p.is_available ?? p.available ?? true,
    sort_order: p.sort_order ?? 0,
  };
}

function mapBlogPost(p) {
  return {
    ...p,
    image: p.cover_image_url || p.image || p.image_url,
    summary: p.excerpt || p.summary || '',
    excerpt: p.excerpt || p.summary || '',
    body: p.content || p.body || '',
    content: p.content || p.body || '',
    author: p.author || 'Tomoca Coffee',
    category: p.category || 'Tomoca Stories',
    tags: p.tags || '',
    created_date: p.created_date || p.published_at || p.created_at,
    is_published: p.is_published ?? p.published ?? true,
  };
}

async function listProducts(sortField = 'created_at', limit = 50) {
  // Heritage UI often asks for sort_order, but some existing Supabase schemas do not
  // have that column yet. Try the requested order first, then fall back safely.
  let query = supabase
    .from('products')
    .select('*')
    .limit(limit);

  if (sortField) {
    query = query.order(sortField, { ascending: sortField === 'sort_order' || sortField === 'name' });
  }

  let { data, error } = await query;

  if (error && String(error.message || '').toLowerCase().includes('sort_order')) {
    const retry = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.warn('Product.list fallback:', error.message);
    return productFallback;
  }
  return (data || []).map(mapProduct);
}

async function createProduct(data) {
  const row = {
    name: data.name,
    description: data.description || data.roast_profile || data.notes || null,
    price: Number(data.price ?? data.price_usd ?? 0),
    image_url: data.image_url || data.image || null,
    category: data.category || 'coffee',
    origin: data.origin || null,
    roast_level: data.roast_level || null,
    weight_grams: data.weight_grams || parseInt(String(data.weight || '').replace(/\D/g, ''), 10) || null,
    is_available: data.available ?? data.is_available ?? true,
    is_featured: data.is_featured ?? false,
  };
  const { data: inserted, error } = await supabase.from('products').insert(row).select('*').single();
  if (error) throw error;
  return mapProduct(inserted);
}

async function updateProduct(id, data) {
  const row = {
    name: data.name,
    description: data.description || data.roast_profile || data.notes || null,
    price: data.price ?? data.price_usd,
    image_url: data.image_url || data.image,
    category: data.category,
    origin: data.origin,
    roast_level: data.roast_level,
    weight_grams: data.weight_grams || parseInt(String(data.weight || '').replace(/\D/g, ''), 10) || undefined,
    is_available: data.available ?? data.is_available,
    is_featured: data.is_featured,
  };
  Object.keys(row).forEach((key) => row[key] === undefined && delete row[key]);
  const { data: updated, error } = await supabase.from('products').update(row).eq('id', id).select('*').single();
  if (error) throw error;
  return mapProduct(updated);
}

async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
}

async function listJournalPosts(sortField = 'created_at', limit = 50) {
  let { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .or('is_published.eq.true,published.eq.true')
    .order(sortField, { ascending: false })
    .limit(limit);

  // If a project only has one publish flag, retry with the more common one.
  if (error) {
    const retry = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.warn('JournalPost.list fallback:', error.message);
    return [];
  }
  return (data || []).map(mapBlogPost);
}

async function filterJournalPosts(filters = {}) {
  let query = supabase.from('blog_posts').select('*');
  if (filters.id) {
    // The Heritage route uses /journal/:id, but we allow either UUID id or slug.
    query = query.or(`id.eq.${filters.id},slug.eq.${filters.id}`);
  }
  if (filters.slug) query = query.eq('slug', filters.slug);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapBlogPost);
}

async function updateJournalPost(id, data) {
  const row = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || data.summary,
    content: data.content || data.body,
    cover_image_url: data.cover_image_url || data.image,
    is_published: data.is_published ?? data.published,
    published: data.published ?? data.is_published,
    published_at: data.published_at,
  };
  Object.keys(row).forEach((key) => row[key] === undefined && delete row[key]);
  const { data: updated, error } = await supabase.from('blog_posts').update(row).eq('id', id).select('*').single();
  if (error) throw error;
  return mapBlogPost(updated);
}

async function deleteJournalPost(id) {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw error;
  return true;
}

async function createInquiry(data) {
  // Use newsletter_subscriptions when an email is provided; otherwise no-op so Contact UI does not break.
  if (data?.email) {
    const { error } = await supabase.from('newsletter_subscriptions').upsert({ email: data.email, status: 'active' }, { onConflict: 'email' });
    if (error) console.warn('Inquiry newsletter fallback:', error.message);
  }
  return { ok: true, ...data };
}

async function createOrder(data) {
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      source: 'website',
      customer_name: data.name || data.customer_name || 'Website customer',
      phone: data.phone || '—',
      address: data.address || '—',
      payment_status: 'unpaid',
      order_status: 'placed',
      notes: data.notes || null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return order;
}


async function listLocations(sortField = 'created_at', limit = 50) {
  let { data, error } = await supabase
    .from('store_locations')
    .select('*')
    .eq('is_active', true)
    .order(sortField, { ascending: sortField === 'name' })
    .limit(limit);

  if (error) {
    const retry = await supabase
      .from('store_locations')
      .select('*')
      .limit(limit);
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.warn('Location.list fallback:', error.message);
    return [];
  }

  return (data || []).map((l) => ({
    ...l,
    image: l.image_url,
    hours: l.hours || l.opening_hours || 'Open daily',
    vibe: l.description || l.region || '',
    tag: l.is_flagship ? 'Flagship' : (l.region || l.city || 'Store'),
    mapUrl: l.latitude && l.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${l.latitude},${l.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([l.name, l.address, l.city].filter(Boolean).join(' '))}`,
    embedSrc: l.latitude && l.longitude
      ? `https://maps.google.com/maps?q=${l.latitude},${l.longitude}&output=embed&z=16`
      : `https://maps.google.com/maps?q=${encodeURIComponent([l.name, l.address, l.city].filter(Boolean).join(' '))}&output=embed&z=14`,
    services: ['Dine-in', 'Takeaway', 'Beans'],
  }));
}

export const base44 = {
  entities: {
    Product: { list: listProducts, create: createProduct, update: updateProduct, delete: deleteProduct },
    Location: { list: listLocations },
    JournalPost: { list: listJournalPosts, filter: filterJournalPosts, update: updateJournalPost, delete: deleteJournalPost },
    Inquiry: { create: createInquiry },
    Order: { create: createOrder },
  },
  integrations: {
    Core: {
      InvokeLLM: async () => ({ articles: [] }),
    },
  },
  auth: {
    me: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
    loginViaEmailPassword: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    register: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    },
    logout: async () => supabase.auth.signOut(),
    loginWithProvider: async () => supabase.auth.signInWithOAuth({ provider: 'google' }),
    redirectToLogin: () => { window.location.href = '/login'; },
    resetPasswordRequest: async (email) => supabase.auth.resetPasswordForEmail(email),
    resetPassword: async () => ({ ok: true }),
    verifyOtp: async () => ({ access_token: null }),
    setToken: () => {},
    resendOtp: async () => ({ ok: true }),
  },
};

export default base44;
