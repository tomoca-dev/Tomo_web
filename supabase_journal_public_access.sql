-- Fix public Journal visibility
-- Run this in Supabase SQL Editor if non-admin users/visitors cannot see published journal posts.

alter table public.blog_posts enable row level security;

-- Ensure the field used by the current frontend exists.
alter table public.blog_posts
add column if not exists is_published boolean not null default false;

-- Public visitors can read published posts without logging in.
drop policy if exists "Public read published blog posts" on public.blog_posts;
create policy "Public read published blog posts"
on public.blog_posts
for select
to anon, authenticated
using (is_published = true);

-- Admins can manage all posts.
drop policy if exists "Admin manage blog posts" on public.blog_posts;
create policy "Admin manage blog posts"
on public.blog_posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

notify pgrst, 'reload schema';
