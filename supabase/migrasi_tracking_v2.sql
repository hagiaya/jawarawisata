-- Ubah constraint status dan payment_status di tabel bookings agar lebih lengkap untuk tracking
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending', 'confirmed', 'process', 'completed', 'cancelled'));

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_payment_status_check 
  CHECK (payment_status IN ('unpaid', 'dp_paid', 'paid', 'refunded'));

-- Pastikan ada kolom trip_detail (JSONB) jika belum ada untuk detail harian & mutawif
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS trip_detail jsonb default null;
