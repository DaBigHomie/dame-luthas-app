-- ============================================================================
-- Dame Luthas — Contact submissions, navigation menus, subscribers
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE public.submission_status AS ENUM ('new', 'read', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.subscriber_status AS ENUM ('subscribed', 'unsubscribed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE public.contact_submissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  website     TEXT,
  message     TEXT NOT NULL,
  status      public.submission_status NOT NULL DEFAULT 'new',
  source      TEXT NOT NULL DEFAULT 'contact_form',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX contact_submissions_status_idx ON public.contact_submissions(status);
CREATE INDEX contact_submissions_created_idx ON public.contact_submissions(created_at DESC);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
-- Public can submit; only admins read or update.
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions FOR UPDATE USING (public.is_admin());

CREATE TABLE public.navigation_menus (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  items       JSONB NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.navigation_menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Navigation menus are viewable by everyone"
  ON public.navigation_menus FOR SELECT USING (true);
CREATE POLICY "Admins can insert navigation menus"
  ON public.navigation_menus FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update navigation menus"
  ON public.navigation_menus FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete navigation menus"
  ON public.navigation_menus FOR DELETE USING (public.is_admin());

CREATE TABLE public.subscribers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  status       public.subscriber_status NOT NULL DEFAULT 'subscribed',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX subscribers_status_idx ON public.subscribers(status);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view subscribers"
  ON public.subscribers FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert subscribers"
  ON public.subscribers FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update subscribers"
  ON public.subscribers FOR UPDATE USING (public.is_admin());
CREATE POLICY "Anyone can subscribe"
  ON public.subscribers FOR INSERT WITH CHECK (true);

COMMENT ON TABLE public.contact_submissions IS 'Contact form rows; Resend still sends email — this is the audit trail.';
COMMENT ON TABLE public.navigation_menus   IS 'WP menu JSON from extract (items.nodes tree).';
COMMENT ON TABLE public.subscribers        IS 'Newsletter subscribers for future blog phase.';
