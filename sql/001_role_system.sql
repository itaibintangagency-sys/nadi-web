-- ============================================================
-- BIS Role System — Migration 001
-- Roles: super_admin, admin, client
-- No slot limits. Invite-only (manual by super_admin).
-- ============================================================

-- 1. Tabel profiles ------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('super_admin', 'admin', 'client')),
  full_name text,
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Role & profile info per user. role is set at invite time via auth metadata and copied here by the handle_new_user trigger.';

-- 2. Trigger: auto-create profile saat user baru signup (dari invite) ----
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, invited_by)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    new.raw_user_meta_data->>'full_name',
    nullif(new.raw_user_meta_data->>'invited_by', '')::uuid
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. RLS ------------------------------------------------------------
alter table public.profiles enable row level security;

-- Semua user login bisa lihat profile sendiri
drop policy if exists "view own profile" on public.profiles;
create policy "view own profile" on public.profiles
  for select using (auth.uid() = id);

-- super_admin bisa lihat semua profile (untuk halaman Team)
drop policy if exists "super_admin view all profiles" on public.profiles;
create policy "super_admin view all profiles" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'super_admin'
    )
  );

-- HANYA super_admin yang boleh update role siapapun (cegah self-elevation)
drop policy if exists "super_admin manage roles" on public.profiles;
create policy "super_admin manage roles" on public.profiles
  for update using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'super_admin'
    )
  );

-- 4. Column-level GRANT ----------------------------------------------
-- RLS saja tidak cukup untuk tabel yang dibuat manual — GRANT eksplisit wajib.
grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated; -- user cuma boleh ubah nama sendiri lewat grant kolom, bukan role
grant select, update, insert, delete on public.profiles to service_role;

-- 5. RLS untuk brands & user_brands (scoping berbasis role) -----------
-- Asumsi tabel brands & user_brands sudah ada di project ini.
alter table public.brands enable row level security;

drop policy if exists "brand access by role" on public.brands;
create policy "brand access by role" on public.brands
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'super_admin'
    )
    or id in (
      select brand_id from public.user_brands where user_id = auth.uid()
    )
  );

-- Cuma super_admin yang boleh create/update/delete brand
drop policy if exists "super_admin manage brands" on public.brands;
create policy "super_admin manage brands" on public.brands
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'super_admin'
    )
  );

grant select on public.brands to authenticated;
grant select, insert, update, delete on public.brands to service_role;
