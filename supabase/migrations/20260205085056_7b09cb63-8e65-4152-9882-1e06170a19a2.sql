-- Create store_locations table for shop locations
CREATE TABLE public.store_locations (
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

-- Enable RLS
ALTER TABLE public.store_locations ENABLE ROW LEVEL SECURITY;

-- Everyone can view active store locations
CREATE POLICY "Store locations are viewable by everyone"
ON public.store_locations
FOR SELECT
USING (is_active = true);

-- Admins can manage store locations
CREATE POLICY "Admins can manage store locations"
ON public.store_locations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_store_locations_updated_at
BEFORE UPDATE ON public.store_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample Ethiopian coffee shop locations
INSERT INTO public.store_locations (name, address, city, region, phone, is_flagship, opening_hours) VALUES
('TOMOCA Flagship - Piazza', 'Wavel Street, Piazza', 'Addis Ababa', 'Addis Ababa', '+251 11 111 2345', true, '{"monday": "6:00 AM - 9:00 PM", "tuesday": "6:00 AM - 9:00 PM", "wednesday": "6:00 AM - 9:00 PM", "thursday": "6:00 AM - 9:00 PM", "friday": "6:00 AM - 9:00 PM", "saturday": "7:00 AM - 10:00 PM", "sunday": "7:00 AM - 8:00 PM"}'),
('TOMOCA Bole', 'Bole Road, Atlas Area', 'Addis Ababa', 'Addis Ababa', '+251 11 222 3456', false, '{"monday": "6:30 AM - 8:00 PM", "tuesday": "6:30 AM - 8:00 PM", "wednesday": "6:30 AM - 8:00 PM", "thursday": "6:30 AM - 8:00 PM", "friday": "6:30 AM - 8:00 PM", "saturday": "7:00 AM - 9:00 PM", "sunday": "8:00 AM - 6:00 PM"}'),
('TOMOCA Kazanchis', 'Kazanchis Business District', 'Addis Ababa', 'Addis Ababa', '+251 11 333 4567', false, '{"monday": "7:00 AM - 7:00 PM", "tuesday": "7:00 AM - 7:00 PM", "wednesday": "7:00 AM - 7:00 PM", "thursday": "7:00 AM - 7:00 PM", "friday": "7:00 AM - 7:00 PM", "saturday": "8:00 AM - 6:00 PM", "sunday": "Closed"}'),
('TOMOCA Yirgacheffe Origin', 'Main Street', 'Yirgacheffe', 'SNNPR', '+251 46 111 2222', false, '{"monday": "7:00 AM - 6:00 PM", "tuesday": "7:00 AM - 6:00 PM", "wednesday": "7:00 AM - 6:00 PM", "thursday": "7:00 AM - 6:00 PM", "friday": "7:00 AM - 6:00 PM", "saturday": "8:00 AM - 5:00 PM", "sunday": "8:00 AM - 3:00 PM"}'),
('TOMOCA Hawassa', 'Lake Shore Road', 'Hawassa', 'Sidama', '+251 46 222 3333', false, '{"monday": "6:30 AM - 8:00 PM", "tuesday": "6:30 AM - 8:00 PM", "wednesday": "6:30 AM - 8:00 PM", "thursday": "6:30 AM - 8:00 PM", "friday": "6:30 AM - 8:00 PM", "saturday": "7:00 AM - 9:00 PM", "sunday": "7:00 AM - 6:00 PM"}');

-- Create coffee_regions table for Ethiopian coffee region information
CREATE TABLE public.coffee_regions (
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

-- Enable RLS
ALTER TABLE public.coffee_regions ENABLE ROW LEVEL SECURITY;

-- Everyone can view coffee regions
CREATE POLICY "Coffee regions are viewable by everyone"
ON public.coffee_regions
FOR SELECT
USING (is_active = true);

-- Admins can manage coffee regions
CREATE POLICY "Admins can manage coffee regions"
ON public.coffee_regions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert Ethiopian coffee regions with details
INSERT INTO public.coffee_regions (name, display_name, description, altitude_range, flavor_notes, harvest_season, display_order) VALUES
('yirgacheffe', 'Yirgacheffe', 'The crown jewel of Ethiopian coffee. Yirgacheffe is renowned worldwide for producing some of the most distinctive and sought-after washed coffees. The region''s high altitude, rich soil, and ideal climate create beans with an unmistakable floral and citrus character.', '1,750 - 2,200m', ARRAY['Floral', 'Bergamot', 'Lemon', 'Honey', 'Jasmine'], 'October - January', 1),
('sidama', 'Sidamo/Sidama', 'One of Ethiopia''s premier coffee regions, Sidama produces complex coffees with a perfect balance of fruit and wine notes. The region''s cooperative washing stations ensure meticulous processing, resulting in clean, bright cups with remarkable depth.', '1,500 - 2,200m', ARRAY['Berry', 'Citrus', 'Wine', 'Chocolate', 'Floral'], 'October - January', 2),
('harrar', 'Harrar', 'The ancient coffee region of Harrar produces Ethiopia''s most distinctive natural-processed coffees. Grown in the eastern highlands, these wild and complex beans offer an intense, fruit-forward experience unlike any other coffee in the world.', '1,500 - 2,100m', ARRAY['Blueberry', 'Wine', 'Chocolate', 'Spice', 'Wild Fruit'], 'October - February', 3),
('limu', 'Limu', 'From the lush forests of western Ethiopia, Limu coffees are known for their well-balanced profile and gentle complexity. Often overshadowed by its famous neighbors, Limu offers a refined, washed coffee experience with subtle sweetness.', '1,400 - 2,100m', ARRAY['Wine', 'Spice', 'Floral', 'Sweet', 'Balanced'], 'November - January', 4),
('ghimbi', 'Ghimbi/Gimbi', 'The Ghimbi region in western Ethiopia produces bold, full-bodied coffees with distinctive fruity undertones. Known for both washed and natural processing, Ghimbi beans offer a heavier body compared to their eastern counterparts.', '1,500 - 2,000m', ARRAY['Fruity', 'Complex', 'Full Body', 'Earthy', 'Sweet'], 'November - January', 5),
('lekempti', 'Lekempti/Wellega', 'From the Wellega zone comes Lekempti coffee, prized for its unique fruity character and lighter body. These beans showcase Ethiopia''s diversity, offering bright acidity with distinctive tropical fruit notes and a clean finish.', '1,500 - 2,100m', ARRAY['Tropical Fruit', 'Bright', 'Light Body', 'Clean', 'Sweet'], 'November - January', 6),
('guji', 'Guji', 'An emerging star in specialty coffee, Guji has rapidly gained recognition for producing exceptional coffees rivaling Yirgacheffe. The region''s ancient coffee forests yield beans with remarkable complexity and intense fruit character.', '1,800 - 2,300m', ARRAY['Stone Fruit', 'Floral', 'Complex', 'Bright', 'Tea-like'], 'October - January', 7),
('djimma', 'Djimma/Djamma', 'Ethiopia''s largest coffee-producing region, Djimma is the heartland of commercial Ethiopian coffee. While known for volume, the region also produces quality specialty lots with characteristic mild, balanced profiles.', '1,400 - 2,000m', ARRAY['Mild', 'Balanced', 'Nutty', 'Chocolate', 'Low Acid'], 'October - January', 8);