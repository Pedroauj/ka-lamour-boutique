-- Fase 1 da área administrativa: papéis, categorias, produtos, fotos de produto.
-- Rode este arquivo inteiro no SQL Editor do Supabase (Dashboard > SQL Editor > New query).

-- ---------- papéis (admin) ----------
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- security definer: evita recursão de RLS ao checar papel dentro de outras policies
create function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "users can read their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- ---------- trigger genérico de updated_at ----------
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- categorias ----------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  product_type text not null check (product_type in ('roupa','perfume','cosmetico')),
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "public can read categories"
  on public.categories for select
  using (true);

create policy "admins can write categories"
  on public.categories for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ---------- produtos ----------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  slug text not null unique,
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  description text,
  stock integer not null default 0,
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  is_active boolean not null default true,
  sizes text[],
  colors jsonb,
  volumes text[],
  pyramid jsonb,
  actives text[],
  fabric text,
  care text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "public can read products"
  on public.products for select
  using (true);

create policy "admins can write products"
  on public.products for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------- fotos de produto ----------
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  storage_path text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.product_images enable row level security;

create policy "public can read product images"
  on public.product_images for select
  using (true);

create policy "admins can write product images"
  on public.product_images for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ---------- storage bucket de fotos ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public can view product images bucket"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "admins can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "admins can update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "admins can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
