
-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('candidate', 'employer', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'candidate',
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  specialties TEXT[],
  experience_years INTEGER,
  is_litsea_graduate BOOLEAN DEFAULT false,
  company_name TEXT,
  company_logo_url TEXT,
  company_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'candidate')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Job postings table
CREATE TABLE public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  salary_range TEXT,
  contract_type TEXT,
  location TEXT,
  specialty TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active job postings are viewable by everyone"
  ON public.job_postings FOR SELECT USING (is_active = true);

CREATE POLICY "Employers can insert own postings"
  ON public.job_postings FOR INSERT
  WITH CHECK (employer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'employer'));

CREATE POLICY "Employers can update own postings"
  ON public.job_postings FOR UPDATE
  USING (employer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Employers can delete own postings"
  ON public.job_postings FOR DELETE
  USING (employer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_posting_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_posting_id, candidate_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own applications"
  ON public.applications FOR SELECT
  USING (candidate_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Employers can view applications to their jobs"
  ON public.applications FOR SELECT
  USING (job_posting_id IN (
    SELECT jp.id FROM job_postings jp
    JOIN profiles p ON jp.employer_id = p.id
    WHERE p.user_id = auth.uid()
  ));

CREATE POLICY "Candidates can apply to jobs"
  ON public.applications FOR INSERT
  WITH CHECK (candidate_id IN (SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'candidate'));

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Users can upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Employers can view applicant documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND EXISTS (
    SELECT 1 FROM applications a
    JOIN profiles p ON a.candidate_id = p.id
    JOIN job_postings jp ON a.job_posting_id = jp.id
    JOIN profiles emp ON jp.employer_id = emp.id
    WHERE emp.user_id = auth.uid()
    AND p.user_id::text = (storage.foldername(name))[1]
  ));

CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- User roles table for admin
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin')
$$;

CREATE POLICY "Admins can view roles"
  ON public.user_roles FOR SELECT
  USING (public.has_admin_role(auth.uid()));
