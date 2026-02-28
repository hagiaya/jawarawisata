-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for Umroh Packages
create table packages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  price decimal(12, 2) not null,
  start_date date not null,
  end_date date not null,
  image_url text,
  capacity integer,
  available_seats integer,
  package_type text, -- 'Reguler', 'VIP', 'Plus Turki', etc.
  hotel_makkah text,
  hotel_madinah text,
  airlines text,
  promo_price decimal(12, 2),
  itinerary_pdf_url text,
  is_active boolean default true
);

alter table packages enable row level security;

create policy "Packages are viewable by everyone." on packages
  for select using (true);

create policy "Only admins can insert packages." on packages
  for insert with check (auth.role() = 'service_role'); -- Adjust based on role management

-- Create a table for Bookings
create table bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  package_id uuid references packages not null,
  status text check (status in ('pending', 'confirmed', 'cancelled')) default 'pending',
  payment_status text check (payment_status in ('unpaid', 'paid', 'refunded')) default 'unpaid',
  ktp_url text,
  passport_url text,
  payment_method text check (payment_method in ('full', 'installment', 'dp')),
  invoice_id text,
  tracking_data jsonb default null,
  foreign key (user_id) references profiles(id),
  foreign key (package_id) references packages(id)
);

alter table bookings enable row level security;

create policy "Users can view their own bookings." on bookings
  for select using (auth.uid() = user_id);

create policy "Users can insert their own bookings." on bookings
  for insert with check (auth.uid() = user_id);

-- Migration command for existing local db
-- alter table bookings add column if not exists tracking_data jsonb default null;

-- ==========================================
-- 1. STORAGE: Receipts & Documents Bucket
-- ==========================================
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', true) on conflict do nothing;

create policy "Receipts viewable by everyone" on storage.objects
  for select using (bucket_id = 'receipts');
create policy "Anyone can upload a receipt" on storage.objects
  for insert with check (bucket_id = 'receipts');
create policy "Users can update their own receipts" on storage.objects
  for update using (bucket_id = 'receipts');

-- ==========================================
-- 2. DEPARTURES: Manajemen Kloter
-- ==========================================
create table departures (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  kloter_name text not null,
  departure_date date not null,
  airlines text not null,
  package_id uuid references packages(id),
  mutawif_name text,
  status text check (status in ('Persiapan', 'Selesai', 'Dibatalkan')) default 'Persiapan',
  notes text
);

alter table departures enable row level security;
create policy "Departures are viewable by everyone." on departures for select using (true);
create policy "Only admins can modify departures" on departures for all using (auth.role() = 'service_role');

-- Migration for bookings to link to kloter:
-- alter table bookings add column if not exists departure_id uuid references departures(id) default null;
