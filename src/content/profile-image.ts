/** Canonical Dame Luthas headshot (matches /about). */
export const PROFILE_IMAGE = "/assets/site/IMG_0666-2-2500px.webp";

/** Prefer full-size profile asset for large hero panels. */
export function toHeroProfileImage(aboutImage: string | null | undefined): string {
  if (!aboutImage) return PROFILE_IMAGE;
  if (aboutImage.includes("IMG_0666") || aboutImage.includes("home-04")) {
    return PROFILE_IMAGE;
  }
  return aboutImage;
}
