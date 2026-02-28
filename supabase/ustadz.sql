-- Tabel Ustadz Pembimbing
-- Jalankan ini di Supabase SQL Editor

create table if not exists ustadz (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  role text,
  photo_url text not null,
  sort_order integer default 1,
  is_active boolean default true
);

-- Enable RLS
alter table ustadz enable row level security;

-- Semua orang bisa baca (untuk tampilin di landing page)
create policy "Ustadz are viewable by everyone." on ustadz
  for select using (true);

-- Hanya service_role yang bisa insert/update/delete
create policy "Only admins can manage ustadz." on ustadz
  for all using (auth.role() = 'service_role');

-- Insert data awal
insert into ustadz (name, role, photo_url, sort_order, is_active) values
  (
    'Ustadz Adi Hidayat, Lc., M.A.',
    'Ulama & Dai Nasional',
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQPhIiS8RTh1zGO3qo9S9XsaQ8TANKkRvWoLfwlJS_XQUgW80885R56r97MUgGGPMxq9sQx1bVqPQshLkhBKdl5C3y3YeDEePtqPGUhTydTFRx07eZrE9SyTxKlBbdmstFPv9D4kk-RKY/s584/images+%25281%2529.jpg',
    1,
    true
  ),
  (
    'Ustadz Abdul Somad, Lc., M.A.',
    'Ulama & Dai Nasional',
    'https://d54-invdn-com.investing.com/content/pic95ba09ceedeef79d6e42480271821e81.jpg',
    2,
    true
  ),
  (
    'Ustadz Khalid Basalamah, M.A.',
    'Dai & Ulama Islam',
    'https://magelangekspres.disway.id/upload/73b306fd3a095052d32f420e4674067e.jpeg',
    3,
    true
  ),
  (
    'Ustadz Felix Siauw',
    'Dai & Penulis',
    'https://satriadharma.com/wp-content/uploads/2022/01/ustad-felix-siauw-instagram.jpg',
    4,
    true
  );
