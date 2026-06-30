-- ============================================================================
-- Dame Luthas — Pages, posts, testimonials
-- ============================================================================

CREATE TABLE public.pages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_id               INTEGER UNIQUE,
  slug                TEXT NOT NULL UNIQUE,
  title               TEXT,
  excerpt             TEXT,
  body_html           TEXT,
  href                TEXT,
  featured_image_url  TEXT,
  featured_image_alt  TEXT,
  featured_media_id   UUID REFERENCES public.media(id) ON DELETE SET NULL,
  status              public.content_status NOT NULL DEFAULT 'publish',
  menu_order          INTEGER NOT NULL DEFAULT 0,
  published_at        TIMESTAMPTZ,
  modified_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX pages_slug_idx   ON public.pages(slug);
CREATE INDEX pages_status_idx ON public.pages(status);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published pages are viewable by everyone"
  ON public.pages FOR SELECT USING (status = 'publish');
CREATE POLICY "Admins can view all pages"
  ON public.pages FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert pages"
  ON public.pages FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update pages"
  ON public.pages FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete pages"
  ON public.pages FOR DELETE USING (public.is_admin());

CREATE TABLE public.posts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_id               INTEGER UNIQUE,
  slug                TEXT NOT NULL UNIQUE,
  title               TEXT,
  excerpt             TEXT,
  body_html           TEXT,
  featured_image_url  TEXT,
  featured_image_alt  TEXT,
  featured_media_id   UUID REFERENCES public.media(id) ON DELETE SET NULL,
  author_id           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status              public.content_status NOT NULL DEFAULT 'draft',
  reading_time        INTEGER,
  published_at        TIMESTAMPTZ,
  modified_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX posts_slug_idx      ON public.posts(slug);
CREATE INDEX posts_status_idx    ON public.posts(status);
CREATE INDEX posts_published_idx ON public.posts(published_at DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are viewable by everyone"
  ON public.posts FOR SELECT USING (status = 'publish');
CREATE POLICY "Admins can view all posts"
  ON public.posts FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert posts"
  ON public.posts FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update posts"
  ON public.posts FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete posts"
  ON public.posts FOR DELETE USING (public.is_admin());

CREATE TABLE public.testimonials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_id       INTEGER UNIQUE,
  quote       TEXT NOT NULL,
  author      TEXT NOT NULL,
  role        TEXT,
  image_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  status      public.content_status NOT NULL DEFAULT 'publish',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX testimonials_status_idx ON public.testimonials(status);
CREATE INDEX testimonials_sort_idx   ON public.testimonials(sort_order);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published testimonials are viewable by everyone"
  ON public.testimonials FOR SELECT USING (status = 'publish');
CREATE POLICY "Admins can view all testimonials"
  ON public.testimonials FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE USING (public.is_admin());
