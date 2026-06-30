
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('contractor', 'owner', 'laborer', 'supplier', 'admin');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  phone TEXT,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read"   ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile upsert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles"   ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ PROJECTS ============
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'active',
  budget NUMERIC(14,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "project member read" ON public.projects FOR SELECT TO authenticated
  USING (auth.uid() = contractor_id OR auth.uid() = owner_id);
CREATE POLICY "contractor manage projects" ON public.projects FOR ALL TO authenticated
  USING (auth.uid() = contractor_id) WITH CHECK (auth.uid() = contractor_id);
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ CRACK SCANS ============
CREATE TABLE public.crack_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  image_url TEXT,
  crack_type TEXT,              -- wall | beam | column | unknown
  severity TEXT,                -- low | moderate | high | critical
  length_mm NUMERIC(10,2),
  width_mm NUMERIC(10,2),
  depth_mm NUMERIC(10,2),
  diagnosis TEXT,
  repair_solution TEXT,
  raw_ai JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crack_scans TO authenticated;
GRANT ALL ON public.crack_scans TO service_role;
ALTER TABLE public.crack_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own scans" ON public.crack_scans FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ AUDITS ============
CREATE TABLE public.audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  category TEXT NOT NULL,       -- safety | structural | compliance
  title TEXT NOT NULL,
  score INT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audits TO authenticated;
GRANT ALL ON public.audits TO service_role;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own audits" ON public.audits FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.audit_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pass | fail | pending
  note TEXT
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_items TO authenticated;
GRANT ALL ON public.audit_items TO service_role;
ALTER TABLE public.audit_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "items via parent audit" ON public.audit_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.audits a WHERE a.id = audit_id AND a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.audits a WHERE a.id = audit_id AND a.user_id = auth.uid()));

-- ============ LABORERS (marketplace) ============
CREATE TABLE public.laborers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  skill TEXT NOT NULL,           -- mason, electrician, plumber, helper, etc.
  experience_years INT DEFAULT 0,
  daily_rate NUMERIC(10,2) NOT NULL,
  city TEXT,
  phone TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 4.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.laborers TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.laborers TO authenticated;
GRANT ALL ON public.laborers TO service_role;
ALTER TABLE public.laborers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone signed in can browse laborers" ON public.laborers FOR SELECT TO authenticated USING (true);
CREATE POLICY "laborer manages self" ON public.laborers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "laborer updates self" ON public.laborers FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "laborer deletes self" ON public.laborers FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER laborers_updated_at BEFORE UPDATE ON public.laborers FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ MATERIAL LISTINGS (marketplace) ============
CREATE TABLE public.material_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  supplier_name TEXT,
  material_type TEXT NOT NULL,   -- cement, steel, bricks, metal, paint
  brand TEXT,
  unit TEXT NOT NULL DEFAULT 'bag',
  unit_price NUMERIC(12,2) NOT NULL,
  min_order INT NOT NULL DEFAULT 1,
  delivery_days INT DEFAULT 2,
  city TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 4.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.material_listings TO authenticated;
GRANT ALL ON public.material_listings TO service_role;
ALTER TABLE public.material_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone signed in browses materials" ON public.material_listings FOR SELECT TO authenticated USING (true);
CREATE POLICY "supplier manages own listings ins" ON public.material_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = supplier_id);
CREATE POLICY "supplier manages own listings upd" ON public.material_listings FOR UPDATE TO authenticated USING (auth.uid() = supplier_id);
CREATE POLICY "supplier manages own listings del" ON public.material_listings FOR DELETE TO authenticated USING (auth.uid() = supplier_id);
CREATE TRIGGER materials_updated_at BEFORE UPDATE ON public.material_listings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ DAILY LOGS ============
CREATE TABLE public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  labor_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  material_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  other_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  work_summary TEXT,
  photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_logs TO authenticated;
GRANT ALL ON public.daily_logs TO service_role;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "logs read by project members" ON public.daily_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.contractor_id = auth.uid() OR p.owner_id = auth.uid())));
CREATE POLICY "logs write by contractor" ON public.daily_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.contractor_id = auth.uid()));
CREATE POLICY "logs update by contractor" ON public.daily_logs FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "logs delete by contractor" ON public.daily_logs FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ============ GROUNDWATER SURVEYS ============
CREATE TABLE public.groundwater_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  probability NUMERIC(5,2),       -- 0..100
  estimated_depth_m NUMERIC(7,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.groundwater_surveys TO authenticated;
GRANT ALL ON public.groundwater_surveys TO service_role;
ALTER TABLE public.groundwater_surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own groundwater" ON public.groundwater_surveys FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
