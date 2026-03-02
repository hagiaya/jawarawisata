-- Buat bucket penyimpanan (storage) bernama "packages" khusus untuk foto umroh
insert into storage.buckets (id, name, public) 
values ('packages', 'packages', true)
on conflict (id) do nothing;

-- Aturan (Policy) agar semua orang bisa melihat gambar secara publik (Membaca file)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'packages' );

-- Aturan (Policy) agar hanya pengguna dengan peran Admin yang bisa mengunggah dan merubah foto
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'packages' AND auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );

CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'packages' AND auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );

CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'packages' AND auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );
