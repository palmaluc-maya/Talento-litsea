
-- Employer-to-candidate contact requests
CREATE TABLE public.employer_candidate_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialty text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(employer_id, candidate_id)
);

ALTER TABLE public.employer_candidate_requests ENABLE ROW LEVEL SECURITY;

-- Employers can insert their own requests
CREATE POLICY "Employers can insert contact requests"
ON public.employer_candidate_requests FOR INSERT TO authenticated
WITH CHECK (employer_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role = 'employer'
));

-- Employers can view their own requests
CREATE POLICY "Employers can view own contact requests"
ON public.employer_candidate_requests FOR SELECT TO authenticated
USING (employer_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

-- Admins can view all
CREATE POLICY "Admins can view all contact requests"
ON public.employer_candidate_requests FOR SELECT TO authenticated
USING (has_admin_role(auth.uid()));

-- Admins can update status
CREATE POLICY "Admins can update contact requests"
ON public.employer_candidate_requests FOR UPDATE TO authenticated
USING (has_admin_role(auth.uid()));

-- Admins can delete
CREATE POLICY "Admins can delete contact requests"
ON public.employer_candidate_requests FOR DELETE TO authenticated
USING (has_admin_role(auth.uid()));
