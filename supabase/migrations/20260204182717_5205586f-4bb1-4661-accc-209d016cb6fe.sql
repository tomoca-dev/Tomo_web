-- ===================================
-- E-COMMERCE EXTENDED SCHEMA
-- Reviews, Wishlist, Subscriptions, Variants, Story Media
-- ===================================

-- Product Variants (size, grind type, etc.)
CREATE TABLE public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "250g Whole Bean"
    sku TEXT UNIQUE,
    price_adjustment NUMERIC DEFAULT 0, -- +/- from base price
    weight_grams INTEGER,
    grind_type TEXT, -- whole_bean, fine, medium, coarse
    stock_quantity INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product Images (gallery support)
CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Product Reviews
CREATE TABLE public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false, -- Admin moderation
    is_featured BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Wishlist
CREATE TABLE public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, product_id)
);

-- Subscriptions / Auto-Reorder
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    frequency_days INTEGER DEFAULT 30, -- delivery interval
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
    next_delivery_date DATE,
    last_delivery_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Story Media (for Our Story page - admin uploaded videos/images)
CREATE TABLE public.story_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'embed')),
    media_url TEXT NOT NULL, -- storage URL or embed URL
    thumbnail_url TEXT,
    display_order INTEGER DEFAULT 0,
    section TEXT DEFAULT 'heritage', -- heritage, purpose, collection
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Site Settings (bean density, etc.)
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID
);

-- Insert default bean density setting
INSERT INTO public.site_settings (key, value) VALUES 
    ('bean_density', '{"level": "default", "multiplier": 1.0}'::jsonb);

-- ===================================
-- ENABLE RLS ON ALL NEW TABLES
-- ===================================

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ===================================
-- RLS POLICIES
-- ===================================

-- Product Variants: Public read, admin write
CREATE POLICY "Variants are viewable by everyone" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admins can manage variants" ON public.product_variants FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Product Images: Public read, admin write
CREATE POLICY "Images are viewable by everyone" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage images" ON public.product_images FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Product Reviews: Public read approved, users write own, admin moderate
CREATE POLICY "Approved reviews are viewable by everyone" ON public.product_reviews 
    FOR SELECT USING (is_approved = true OR user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create reviews" ON public.product_reviews 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.product_reviews 
    FOR UPDATE USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reviews" ON public.product_reviews 
    FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Wishlist: Users manage own
CREATE POLICY "Users can view own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions: Users manage own, admins view all
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions 
    FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions 
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can cancel own subscriptions" ON public.subscriptions 
    FOR DELETE USING (auth.uid() = user_id);

-- Story Media: Public read, admin write
CREATE POLICY "Story media is viewable by everyone" ON public.story_media 
    FOR SELECT USING (is_published = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage story media" ON public.story_media FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Site Settings: Public read, admin write
CREATE POLICY "Settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

-- ===================================
-- TRIGGERS FOR updated_at
-- ===================================

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON public.product_reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_story_media_updated_at BEFORE UPDATE ON public.story_media
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===================================
-- STORAGE BUCKET FOR STORY MEDIA
-- ===================================

INSERT INTO storage.buckets (id, name, public) VALUES ('story-media', 'story-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for story-media
CREATE POLICY "Story media is publicly accessible" ON storage.objects 
    FOR SELECT USING (bucket_id = 'story-media');
CREATE POLICY "Admins can upload story media" ON storage.objects 
    FOR INSERT WITH CHECK (bucket_id = 'story-media' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update story media" ON storage.objects 
    FOR UPDATE USING (bucket_id = 'story-media' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete story media" ON storage.objects 
    FOR DELETE USING (bucket_id = 'story-media' AND has_role(auth.uid(), 'admin'));