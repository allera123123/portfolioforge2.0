create extension if not exists "pgcrypto";

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  profile_picture text,
  email text not null,
  contact_number text,
  address text,
  about_me text not null,
  education text not null,
  skills text not null,
  projects text not null,
  work_experience text,
  social_links text,
  template text not null default 'simple' check (template in ('simple', 'modern', 'creative')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolios_updated_at on public.portfolios;
create trigger portfolios_updated_at
before update on public.portfolios
for each row execute function public.set_updated_at();

alter table public.portfolios enable row level security;

drop policy if exists "Public can read portfolios" on public.portfolios;
create policy "Public can read portfolios" on public.portfolios for select using (true);

drop policy if exists "Public can insert portfolios" on public.portfolios;
create policy "Public can insert portfolios" on public.portfolios for insert with check (true);

drop policy if exists "Public can update portfolios" on public.portfolios;
create policy "Public can update portfolios" on public.portfolios for update using (true) with check (true);

drop policy if exists "Public can delete portfolios" on public.portfolios;
create policy "Public can delete portfolios" on public.portfolios for delete using (true);
