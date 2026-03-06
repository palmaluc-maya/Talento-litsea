CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact request
CREATE POLICY "Anyone can insert contact requests"
ON public.contact_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view contact requests
CREATE POLICY "Admins can view contact requests"
ON public.contact_requests
FOR SELECT
TO authenticated
USING (public.has_admin_role(auth.uid()));

-- Only admins can update contact requests
CREATE POLICY "Admins can update contact requests"
ON public.contact_requests
FOR UPDATE
TO authenticated
USING (public.has_admin_role(auth.uid()));

-- Only admins can delete contact requests
CREATE POLICY "Admins can delete contact requests"
ON public.contact_requests
FOR DELETE
TO authenticated
USING (public.has_admin_role(auth.uid()));