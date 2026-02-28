-- Insert sample packages
insert into packages (title, description, price, start_date, end_date, capacity, image_url, is_active)
values
(
  'Umroh Reguler 9 Days',
  'A spiritual journey of 9 days visiting Makkah and Madinah with 4-star accommodation. Includes direct flight, visa, and professional handling.',
  28500000,
  current_date + interval '30 days',
  current_date + interval '39 days',
  45,
  'https://images.unsplash.com/photo-1565552684305-7e43f3665045?q=80&w=2000&auto=format&fit=crop',
  true
),
(
  'Umroh VIP 12 Days',
  'Premium package for 12 days with 5-star hotels directly facing the Haram. Experience the ultimate comfort in your worship.',
  45000000,
  current_date + interval '45 days',
  current_date + interval '57 days',
  30,
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2000&auto=format&fit=crop',
  true
),
(
  'Umroh Plus Turkey',
  'Combine your spiritual journey with a historical tour of Turkey. Visit Blue Mosque, Hagia Sophia, and more.',
  35000000,
  current_date + interval '60 days',
  current_date + interval '72 days',
  40,
  'https://images.unsplash.com/photo-1527838832700-50592524d78b?q=80&w=2000&auto=format&fit=crop',
  true
);
