-- 1. Tambahkan kolom is_verified ke tabel profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 2. Update fungsi handle_new_user agar menyertakan kolom is_verified (default false)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  is_admin_email boolean;
BEGIN
  is_admin_email := false;
  
  -- Daftar email yang otomatis jadi admin dan terverifikasi
  IF new.email IN ('admin@jawara.com', 'admin@jawarawisata.com') THEN
    is_admin_email := true;
  END IF;

  INSERT INTO public.profiles (id, full_name, phone, role, is_verified)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    CASE WHEN is_admin_email THEN 'admin' ELSE 'user' END,
    is_admin_email -- Admin otomatis terverifikasi
  );
  RETURN new;
END;
$$;
