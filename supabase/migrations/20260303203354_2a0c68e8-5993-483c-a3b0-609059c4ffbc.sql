-- Catalog tables for dynamic zones and techniques
CREATE TABLE public.catalog_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.catalog_techniques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(category, name)
);

ALTER TABLE public.catalog_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_techniques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read zones" ON public.catalog_zones FOR SELECT USING (true);
CREATE POLICY "Anyone can read techniques" ON public.catalog_techniques FOR SELECT USING (true);

CREATE POLICY "Admins can insert zones" ON public.catalog_zones FOR INSERT WITH CHECK (has_admin_role(auth.uid()));
CREATE POLICY "Admins can update zones" ON public.catalog_zones FOR UPDATE USING (has_admin_role(auth.uid()));
CREATE POLICY "Admins can delete zones" ON public.catalog_zones FOR DELETE USING (has_admin_role(auth.uid()));

CREATE POLICY "Admins can insert techniques" ON public.catalog_techniques FOR INSERT WITH CHECK (has_admin_role(auth.uid()));
CREATE POLICY "Admins can update techniques" ON public.catalog_techniques FOR UPDATE USING (has_admin_role(auth.uid()));
CREATE POLICY "Admins can delete techniques" ON public.catalog_techniques FOR DELETE USING (has_admin_role(auth.uid()));

INSERT INTO public.catalog_zones (name, sort_order) VALUES
  ('Cancún', 1), ('Playa del Carmen', 2), ('Tulum', 3), ('Akumal', 4),
  ('Riviera Maya', 5), ('Holbox', 6), ('Cozumel', 7), ('Isla Mujeres', 8);

INSERT INTO public.catalog_techniques (category, name, sort_order) VALUES
  ('Masaje Terapéutico', 'Masaje Relajante', 1),
  ('Masaje Terapéutico', 'Masaje Sueco', 2),
  ('Masaje Terapéutico', 'Masaje de Tejido Profundo', 3),
  ('Masaje Terapéutico', 'Masaje con Piedras Calientes', 4),
  ('Masaje Terapéutico', 'Reflexología Podal', 5),
  ('Masaje Terapéutico', 'Masaje Prenatal', 6),
  ('Masaje Terapéutico', 'Drenaje Linfático', 7),
  ('Cosmetología Estética', 'Tratamientos Faciales', 1),
  ('Cosmetología Estética', 'Tratamientos Corporales', 2),
  ('Cosmetología Estética', 'Depilación', 3),
  ('Cosmetología Estética', 'Pestañas y Cejas', 4),
  ('Estilismo y Belleza', 'Maquillaje Profesional', 1),
  ('Estilismo y Belleza', 'Manicure y Pedicure', 2),
  ('Estilismo y Belleza', 'Peinados', 3),
  ('Estilismo y Belleza', 'Barbería', 4);