CREATE POLICY "Seekers withdraw own applications"
ON public.applications
FOR DELETE
TO authenticated
USING (auth.uid() = seeker_id);

CREATE POLICY "Users delete own CV files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'cvs' AND (storage.foldername(name))[1] = auth.uid()::text);