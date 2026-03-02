-- 1. Tambahkan kolom role ke tabel profiles jika belum ada
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- 2. Buat fungsi bantuan untuk mengecek apakah user adalah admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT exists(SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- 3. Tambahkan Policy RLS untuk akses admin (Aman jika dijalankan ulang)
DROP POLICY IF EXISTS "Admins can do anything on profiles" ON profiles;
CREATE POLICY "Admins can do anything on profiles" ON profiles
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view and update all bookings." ON bookings;
CREATE POLICY "Admins can view and update all bookings." ON bookings
  FOR ALL USING (public.is_admin());

-- 4. Buat / perbarui fungsi trigger rekam user baru + set auto-admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  is_admin boolean;
BEGIN
  -- Email yang masuk di sini otomatis menjadi admin
  is_admin := false;
  
  IF new.email = 'admin@jawarawisata.com' THEN
    is_admin := true;
  END IF;

  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    case when is_admin then 'admin' else 'user' end
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
