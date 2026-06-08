-- Merchandise support for products
-- Your frontend uses products.category = 'merchandise'.
-- Run this if the category column does not exist yet.

alter table public.products
add column if not exists category text default 'coffee';

alter table public.products
add column if not exists is_available boolean not null default true;

alter table public.products
add column if not exists is_featured boolean not null default false;

notify pgrst, 'reload schema';
