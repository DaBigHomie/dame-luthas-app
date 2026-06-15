-- ============================================================================
-- Dame Luthas — Auth / Profiles
-- ============================================================================
-- profiles extends auth.users with optional WP user mapping + admin roles.
-- is_admin() drives admin write RLS across content tables.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE public.profile_role AS ENUM ('editor', 'admin', 'owner');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_user_id    INTEGER UNIQUE,
  auth_user_id  UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  username      TEXT UNIQUE,
  display_name  TEXT,
  email         TEXT,
  role          public.profile_role NOT NULL DEFAULT 'editor',
  avatar_url    TEXT,
  bio           TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX profiles_wp_user_id_idx ON public.profiles(wp_user_id);
CREATE INDEX profiles_role_idx       ON public.profiles(role);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_user_id = auth.uid()
      AND role IN ('admin', 'owner')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE USING (public.is_admin());
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = auth_user_id);

COMMENT ON TABLE public.profiles IS 'Site operators; maps optional WP users to auth.users.';
