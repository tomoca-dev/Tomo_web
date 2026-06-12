-- Run this if public pages (Journal/Shop/Locations/Merchandise) show empty content.
-- It aligns public read policies with the Heritage UI + existing working system.

alter table public.products enable row level security;
drop policy if exists "Public read available products" on public.products;
create policy "Public read available products"
on public.products
for select
to anon, authenticated
using (coalesce(is_available, true) = true);

alter table public.blog_posts enable row level security;
alter table public.blog_posts add column if not exists is_published boolean not null default false;
alter table public.blog_posts add column if not exists published boolean not null default false;
update public.blog_posts set is_published = true where published = true or is_published = true;
drop policy if exists "Public read published blog posts" on public.blog_posts;
create policy "Public read published blog posts"
on public.blog_posts
for select
to anon, authenticated
using (is_published = true or published = true);

alter table public.store_locations enable row level security;
drop policy if exists "Public read active locations" on public.store_locations;
create policy "Public read active locations"
on public.store_locations
for select
to anon, authenticated
using (coalesce(is_active, true) = true);

notify pgrst, 'reload schema';
