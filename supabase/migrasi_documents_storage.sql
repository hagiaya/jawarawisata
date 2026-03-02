-- Buat bucket penyimpanan (storage) bernama "documents" khusus untuk dokumen pribadi jamaah
insert into storage.buckets (id, name, public) 
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Aturan (Policy) agar hanya pemilik dokumen (jamaah) atau Admin yang bisa melihat dokumen
CREATE POLICY "Users can read their own documents" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'documents' AND (auth.uid() = owner OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')) );

-- Aturan (Policy) agar pengguna yang login bisa mengunggah dokumen mereka
CREATE POLICY "Authenticated users can upload documents" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'documents' AND auth.role() = 'authenticated' );

-- Aturan (Policy) agar Admin bisa melakukan tindakan apa saja
CREATE POLICY "Admin All Access" 
ON storage.objects FOR ALL 
USING ( bucket_id = 'documents' AND auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );
