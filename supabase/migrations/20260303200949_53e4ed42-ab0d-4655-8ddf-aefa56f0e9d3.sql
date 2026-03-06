-- Allow admins to update application status
CREATE POLICY "Admins can update applications"
ON public.applications FOR UPDATE
TO authenticated
USING (public.has_admin_role(auth.uid()))
WITH CHECK (public.has_admin_role(auth.uid()));

-- Allow admins to view all applications
CREATE POLICY "Admins can view all applications"
ON public.applications FOR SELECT
TO authenticated
USING (public.has_admin_role(auth.uid()));

-- Allow admins to view all job postings (including inactive)
CREATE POLICY "Admins can view all job postings"
ON public.job_postings FOR SELECT
TO authenticated
USING (public.has_admin_role(auth.uid()));

-- Allow admins to update job postings
CREATE POLICY "Admins can update job postings"
ON public.job_postings FOR UPDATE
TO authenticated
USING (public.has_admin_role(auth.uid()));

-- Allow admins to delete job postings
CREATE POLICY "Admins can delete job postings"
ON public.job_postings FOR DELETE
TO authenticated
USING (public.has_admin_role(auth.uid()));