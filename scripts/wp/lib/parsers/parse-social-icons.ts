import type { CheerioAPI } from "cheerio";

import { cleanText } from "./normalize-url";

export interface SocialLink {
  network: string;
  href: string;
  label?: string;
}

const NETWORK_ALIASES: Record<string, string> = {
  "fa-facebook": "facebook",
  "fa-facebook-f": "facebook",
  "fa-twitter": "twitter",
  "fa-x-twitter": "twitter",
  "fa-linkedin": "linkedin",
  "fa-linkedin-in": "linkedin",
  "fa-instagram": "instagram",
  "fa-youtube": "youtube",
  "fa-github": "github",
};

function detectNetwork(className: string, href: string): string {
  for (const [needle, network] of Object.entries(NETWORK_ALIASES)) {
    if (className.includes(needle)) return network;
  }
  if (href.includes("linkedin")) return "linkedin";
  if (href.includes("facebook")) return "facebook";
  if (href.includes("twitter") || href.includes("x.com")) return "twitter";
  if (href.includes("instagram")) return "instagram";
  if (href.includes("youtube")) return "youtube";
  return "link";
}

/** Parse Elementor `social-icons` widgets from rendered HTML. */
export function parseSocialIcons($: CheerioAPI): SocialLink[] {
  const links: SocialLink[] = [];
  const seen = new Set<string>();

  $('[data-widget_type="social-icons.default"] a, .elementor-social-icon').each(
    (_, anchor) => {
      const $a = $(anchor).is("a") ? $(anchor) : $(anchor).closest("a");
      const href = $a.attr("href") ?? "";
      if (!href || href === "#") return;

      const className = $a.attr("class") ?? "";
      const network = detectNetwork(className, href);
      const key = `${network}|${href}`;
      if (seen.has(key)) return;
      seen.add(key);

      links.push({
        network,
        href,
        label: cleanText($a.attr("aria-label") ?? $a.attr("title") ?? network),
      });
    },
  );

  return links;
}

export function countSocialIconWidgets($: CheerioAPI): number {
  return $('[data-widget_type="social-icons.default"]').length;
}
