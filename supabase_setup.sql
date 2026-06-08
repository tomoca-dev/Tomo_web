-- ==========================================
-- TOMOCA COFFEE CONSOLIDATED DATABASE SETUP
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- ==========================================

-- 1. ENUMS & ROLES
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END $$;

-- 2. CORE TABLES
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'coffee',
  origin TEXT,
  roast_level TEXT,
  weight_grams INTEGER DEFAULT 250,
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- 3. EXTENDED E-COMMERCE TABLES
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    price_adjustment NUMERIC DEFAULT 0,
    weight_grams INTEGER,
    grind_type TEXT,
    stock_quantity INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    frequency_days INTEGER DEFAULT 30,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
    next_delivery_date DATE,
    last_delivery_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.story_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'embed')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    display_order INTEGER DEFAULT 0,
    section TEXT DEFAULT 'heritage',
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID
);

CREATE TABLE IF NOT EXISTS public.store_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT,
  country TEXT NOT NULL DEFAULT 'Ethiopia',
  phone TEXT,
  email TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  opening_hours JSONB DEFAULT '{}',
  is_flagship BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coffee_regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  altitude_range TEXT,
  flavor_notes TEXT[],
  harvest_season TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


-- 4. UTILITIES & SECURITY DEFINER FUNCTION
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;


-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_regions ENABLE ROW LEVEL SECURITY;


-- 6. SECURITY POLICIES (NON-RECURSIVE)
-- user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING ((SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1) = 'admin');
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- products
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- blog_posts
CREATE POLICY "Published posts are viewable by everyone" ON public.blog_posts FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert posts" ON public.blog_posts FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update posts" ON public.blog_posts FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete posts" ON public.blog_posts FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- newsletter_subscribers
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- product_variants
CREATE POLICY "Variants are viewable by everyone" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admins can manage variants" ON public.product_variants FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- product_images
CREATE POLICY "Images are viewable by everyone" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage images" ON public.product_images FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- product_reviews
CREATE POLICY "Approved reviews are viewable by everyone" ON public.product_reviews FOR SELECT USING (is_approved = true OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.product_reviews FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reviews" ON public.product_reviews FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- wishlists
CREATE POLICY "Users can view own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can cancel own subscriptions" ON public.subscriptions FOR DELETE USING (auth.uid() = user_id);

-- story_media
CREATE POLICY "Story media is viewable by everyone" ON public.story_media FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage story media" ON public.story_media FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- site_settings
CREATE POLICY "Settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- store_locations
CREATE POLICY "Store locations are viewable by everyone" ON public.store_locations FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage store locations" ON public.store_locations FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- coffee_regions
CREATE POLICY "Coffee regions are viewable by everyone" ON public.coffee_regions FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage coffee regions" ON public.coffee_regions FOR ALL USING (public.has_role(auth.uid(), 'admin'));


-- 7. TRIGGER FUNCTION & AUTO-UPDATE ACTIONS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON public.product_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_story_media_updated_at BEFORE UPDATE ON public.story_media FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_store_locations_updated_at BEFORE UPDATE ON public.store_locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 8. AUTH SIGNUP TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'btesfaye236@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin();


-- 9. STORAGE BUCKETS CONFIGURATION (ONLY FOR SUPABASE INSTANCES)
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('story-media', 'story-media', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Product images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Story media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'story-media');
CREATE POLICY "Admins can upload story media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'story-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update story media" ON storage.objects FOR UPDATE USING (bucket_id = 'story-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete story media" ON storage.objects FOR DELETE USING (bucket_id = 'story-media' AND public.has_role(auth.uid(), 'admin'));


-- 10. SEED DATA INSERTS
INSERT INTO public.site_settings (key, value) VALUES ('bean_density', '{"level": "default", "multiplier": 1.0}'::jsonb) ON CONFLICT (key) DO NOTHING;

INSERT INTO public.products (name, description, price, category, origin, roast_level, weight_grams, is_featured) VALUES
('Ethiopian Yirgacheffe', 'Bright and fruity with floral notes and a clean finish. Our signature single-origin from the birthplace of coffee.', 24.99, 'coffee', 'Ethiopia', 'Light', 250, true),
('Colombian Supremo', 'Balanced and smooth with notes of caramel, nuts, and a hint of citrus.', 22.99, 'coffee', 'Colombia', 'Medium', 250, true),
('Sumatra Mandheling', 'Bold and earthy with a full body, low acidity, and notes of dark chocolate.', 26.99, 'coffee', 'Indonesia', 'Dark', 250, true),
('House Blend', 'Our signature blend combining beans from three continents for a perfectly balanced cup.', 19.99, 'coffee', 'Blend', 'Medium', 250, false),
('Espresso Roast', 'Rich and intense with a velvety crema. Perfect for espresso-based drinks.', 23.99, 'coffee', 'Blend', 'Dark', 250, true),
('Kenya AA', 'Bright and wine-like with blackcurrant and berry notes. A true African gem.', 28.99, 'coffee', 'Kenya', 'Medium-Light', 250, false)
ON CONFLICT DO NOTHING;

INSERT INTO public.store_locations (name, address, city, region, phone, is_flagship, opening_hours) VALUES
('TOMOCA Flagship - Piazza', 'Wavel Street, Piazza', 'Addis Ababa', 'Addis Ababa', '+251 11 111 2345', true, '{"monday": "6:00 AM - 9:00 PM", "tuesday": "6:00 AM - 9:00 PM", "wednesday": "6:00 AM - 9:00 PM", "thursday": "6:00 AM - 9:00 PM", "friday": "6:00 AM - 9:00 PM", "saturday": "7:00 AM - 10:00 PM", "sunday": "7:00 AM - 8:00 PM"}'),
('TOMOCA Bole', 'Bole Road, Atlas Area', 'Addis Ababa', 'Addis Ababa', '+251 11 222 3456', false, '{"monday": "6:30 AM - 8:00 PM", "tuesday": "6:30 AM - 8:00 PM", "wednesday": "6:30 AM - 8:00 PM", "thursday": "6:30 AM - 8:00 PM", "friday": "6:30 AM - 8:00 PM", "saturday": "7:00 AM - 9:00 PM", "sunday": "8:00 AM - 6:00 PM"}'),
('TOMOCA Kazanchis', 'Kazanchis Business District', 'Addis Ababa', 'Addis Ababa', '+251 11 333 4567', false, '{"monday": "7:00 AM - 7:00 PM", "tuesday": "7:00 AM - 7:00 PM", "wednesday": "7:00 AM - 7:00 PM", "thursday": "7:00 AM - 7:00 PM", "friday": "7:00 AM - 7:00 PM", "saturday": "8:00 AM - 6:00 PM", "sunday": "Closed"}'),
('TOMOCA Yirgacheffe Origin', 'Main Street', 'Yirgacheffe', 'SNNPR', '+251 46 111 2222', false, '{"monday": "7:00 AM - 6:00 PM", "tuesday": "7:00 AM - 6:00 PM", "wednesday": "7:00 AM - 6:00 PM", "thursday": "7:00 AM - 6:00 PM", "friday": "7:00 AM - 6:00 PM", "saturday": "8:00 AM - 5:00 PM", "sunday": "8:00 AM - 3:00 PM"}'),
('TOMOCA Hawassa', 'Lake Shore Road', 'Hawassa', 'Sidama', '+251 46 222 3333', false, '{"monday": "6:30 AM - 8:00 PM", "tuesday": "6:30 AM - 8:00 PM", "wednesday": "6:30 AM - 8:00 PM", "thursday": "6:30 AM - 8:00 PM", "friday": "6:30 AM - 8:00 PM", "saturday": "7:00 AM - 9:00 PM", "sunday": "7:00 AM - 6:00 PM"}')
ON CONFLICT DO NOTHING;

INSERT INTO public.coffee_regions (name, display_name, description, altitude_range, flavor_notes, harvest_season, display_order) VALUES
('yirgacheffe', 'Yirgacheffe', 'The crown jewel of Ethiopian coffee. Yirgacheffe is renowned worldwide for producing some of the most distinctive and sought-after washed coffees.', '1,750 - 2,200m', ARRAY['Floral', 'Bergamot', 'Lemon', 'Honey', 'Jasmine'], 'October - January', 1),
('sidama', 'Sidamo/Sidama', 'One of Ethiopia''s premier coffee regions, Sidama produces complex coffees with a perfect balance of fruit and wine notes.', '1,500 - 2,200m', ARRAY['Berry', 'Citrus', 'Wine', 'Chocolate', 'Floral'], 'October - January', 2),
('harrar', 'Harrar', 'The ancient coffee region of Harrar produces Ethiopia''s most distinctive natural-processed coffees.', '1,500 - 2,100m', ARRAY['Blueberry', 'Wine', 'Chocolate', 'Spice', 'Wild Fruit'], 'October - February', 3),
('limu', 'Limu', 'From the lush forests of western Ethiopia, Limu coffees are known for their well-balanced profile and gentle complexity.', '1,400 - 2,100m', ARRAY['Wine', 'Spice', 'Floral', 'Sweet', 'Balanced'], 'November - January', 4),
('guji', 'Guji', 'An emerging star in specialty coffee, Guji has rapidly gained recognition for producing exceptional coffees rivaling Yirgacheffe.', '1,800 - 2,300m', ARRAY['Stone Fruit', 'Floral', 'Complex', 'Bright', 'Tea-like'], 'October - January', 7)
ON CONFLICT (name) DO NOTHING;
