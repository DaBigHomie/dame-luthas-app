-- ============================================================================
-- Dame Luthas — Media library + site settings
-- ============================================================================

CREATE TABLE public.media (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_attachment_id  INTEGER UNIQUE,
  storage_path      TEXT,
  public_url        TEXT,
  source_url        TEXT,
  attached_file     TEXT,
  mime_type         TEXT,
  width             INTEGER,
  height            INTEGER,
  alt_text          TEXT,
  title             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX media_wp_attachment_id_idx ON public.media(wp_attachment_id);
CREATE INDEX media_mime_type_idx        ON public.media(mime_type);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media is viewable by everyone"
  ON public.media FOR SELECT USING (true);
CREATE POLICY "Admins can insert media"
  ON public.media FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update media"
  ON public.media FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete media"
  ON public.media FOR DELETE USING (public.is_admin());

-- Key/value site config (hero, contact, nav overrides, feature flags).
CREATE TABLE public.site_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings are viewable by everyone"
  ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE USING (public.is_admin());

COMMENT ON TABLE public.media         IS 'WP attachment manifest; storage_path/public_url filled after bucket upload.';
COMMENT ON TABLE public.site_settings IS 'Singleton JSON config keyed by string (e.g. site, hero, contact).';
