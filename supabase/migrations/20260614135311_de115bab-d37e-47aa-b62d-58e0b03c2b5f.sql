
CREATE POLICY "users upload own crack photos" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'crack-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "users read own crack photos" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'crack-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "users delete own crack photos" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'crack-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
