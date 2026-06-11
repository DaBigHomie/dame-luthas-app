/** Default hero when data/migrated/content.json is absent (e.g. CI). */
export const heroFallback = {
  eyebrow: "Hi, I'm",
  title: "DAME LUTHAS. Lets Build Together.",
  subtitle:
    "I partner with organizations to solve complex technology challenges and build digital products that drive measurable growth",
  ctaPrimary: { label: "Contact Me", href: "/contact" },
  ctaSecondary: { label: "Case Studies", href: "/portfolio" },
  image: "/wp-migrated/2025/02/home-04.webp" as string | null,
};
