-- ============================================================================
-- Dame Luthas — Portfolio, case studies, services
-- ============================================================================
-- portfolio_items: grid cards + legacy HTML body from WP extract.
-- case_studies: structured sections overlay (native prose registry target).
-- services: consulting service pages.
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE public.content_status AS ENUM ('draft', 'publish', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE public.portfolio_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_id               INTEGER UNIQUE,
  slug                TEXT NOT NULL UNIQUE,
  title               TEXT NOT NULL,
  excerpt             TEXT,
  body_html           TEXT,
  body_text           TEXT,
  href                TEXT,
  featured_image_url  TEXT,
  featured_image_alt  TEXT,
  featured_media_id   UUID REFERENCES public.media(id) ON DELETE SET NULL,
  status              public.content_status NOT NULL DEFAULT 'publish',
  sort_order          INTEGER NOT NULL DEFAULT 0,
  published_at        TIMESTAMPTZ,
  metadata            JSONB NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX portfolio_items_slug_idx   ON public.portfolio_items(slug);
CREATE INDEX portfolio_items_status_idx ON public.portfolio_items(status);
CREATE INDEX portfolio_items_sort_idx   ON public.portfolio_items(sort_order);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published portfolio items are viewable by everyone"
  ON public.portfolio_items FOR SELECT USING (status = 'publish');
CREATE POLICY "Admins can view all portfolio items"
  ON public.portfolio_items FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert portfolio items"
  ON public.portfolio_items FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update portfolio items"
  ON public.portfolio_items FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete portfolio items"
  ON public.portfolio_items FOR DELETE USING (public.is_admin());

CREATE TABLE public.case_studies (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_item_id  UUID NOT NULL UNIQUE REFERENCES public.portfolio_items(id) ON DELETE CASCADE,
  slug               TEXT NOT NULL UNIQUE,
  client             TEXT,
  sectors            TEXT[] NOT NULL DEFAULT '{}',
  year               TEXT,
  native_content     BOOLEAN NOT NULL DEFAULT false,
  sections           JSONB NOT NULL DEFAULT '[]',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX case_studies_slug_idx ON public.case_studies(slug);

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Case studies are viewable when portfolio item is published"
  ON public.case_studies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolio_items p
      WHERE p.id = portfolio_item_id AND p.status = 'publish'
    )
  );
CREATE POLICY "Admins can view all case studies"
  ON public.case_studies FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert case studies"
  ON public.case_studies FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update case studies"
  ON public.case_studies FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete case studies"
  ON public.case_studies FOR DELETE USING (public.is_admin());

CREATE TABLE public.services (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_id               INTEGER UNIQUE,
  slug                TEXT NOT NULL UNIQUE,
  title               TEXT NOT NULL,
  excerpt             TEXT,
  body_html           TEXT,
  body_text           TEXT,
  href                TEXT,
  featured_image_url  TEXT,
  featured_image_alt  TEXT,
  featured_media_id   UUID REFERENCES public.media(id) ON DELETE SET NULL,
  status              public.content_status NOT NULL DEFAULT 'publish',
  sort_order          INTEGER NOT NULL DEFAULT 0,
  published_at        TIMESTAMPTZ,
  metadata            JSONB NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX services_slug_idx   ON public.services(slug);
CREATE INDEX services_status_idx ON public.services(status);
CREATE INDEX services_sort_idx   ON public.services(sort_order);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published services are viewable by everyone"
  ON public.services FOR SELECT USING (status = 'publish');
CREATE POLICY "Admins can view all services"
  ON public.services FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert services"
  ON public.services FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update services"
  ON public.services FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete services"
  ON public.services FOR DELETE USING (public.is_admin());

COMMENT ON TABLE public.portfolio_items IS 'Portfolio / case-study grid entries from WP or admin.';
COMMENT ON TABLE public.case_studies    IS 'Structured case-study sections (JSONB) keyed to portfolio_items.';
COMMENT ON COLUMN public.case_studies.sections IS 'Array of {type: prose|gallery|skills|testimonials|cta, ...}.';
