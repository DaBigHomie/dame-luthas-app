/** Default hero when data/migrated/content.json is absent (e.g. CI). */
import { PROFILE_IMAGE } from "./profile-image";

export const heroFallback = {
  title: "Hi, I'm Dame Luthas. Lets Build Together.",
  subtitle:
    "I partner with organizations to solve complex technology challenges and build digital products that drive measurable growth",
  ctaPrimary: { label: "Contact Me", href: "/contact" },
  image: PROFILE_IMAGE as string | null,
};
