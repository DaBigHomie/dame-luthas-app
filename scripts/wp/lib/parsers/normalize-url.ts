/** Normalize WP media URLs to a canonical uploads path for asset copying. */
export function normalizeUploadUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  const match = url.match(/\/wp-content\/uploads\/(.+)$/i);
  return match ? `/wp-content/uploads/${match[1]}` : null;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}
