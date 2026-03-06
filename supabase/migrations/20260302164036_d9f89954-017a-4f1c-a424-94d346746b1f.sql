
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS zones text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS whatsapp text;
