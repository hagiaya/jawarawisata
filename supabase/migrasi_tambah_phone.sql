-- Tambahkan kolom phone ke tabel profiles jika belum ada
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- Perbarui fungsi trigger handle_new_user agar merekam phone number juga
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  is_admin boolean;
BEGIN
  is_admin := false;
  
  IF new.email = 'admin@jawarawisata.com' THEN
    is_admin := true;
  END IF;

  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    case when is_admin then 'admin' else 'user' end
  );
  RETURN new;
END;
$$;
