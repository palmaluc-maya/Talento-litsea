
-- Add website column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website text;

-- Create candidate_favorites table for employers to track candidates
CREATE TABLE public.candidate_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'favorite',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(employer_id, candidate_id)
);

ALTER TABLE public.candidate_favorites ENABLE ROW LEVEL SECURITY;

-- Employers can manage their own favorites
CREATE POLICY "Employers can view own favorites"
  ON public.candidate_favorites FOR SELECT
  TO authenticated
  USING (employer_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Employers can insert own favorites"
  ON public.candidate_favorites FOR INSERT
  TO authenticated
  WITH CHECK (employer_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role = 'employer'
  ));

CREATE POLICY "Employers can update own favorites"
  ON public.candidate_favorites FOR UPDATE
  TO authenticated
  USING (employer_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Employers can delete own favorites"
  ON public.candidate_favorites FOR DELETE
  TO authenticated
  USING (employer_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));
