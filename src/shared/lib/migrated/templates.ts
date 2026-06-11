import type { MigratedTemplate } from "./content";
import { loadMigrated } from "./content";

export interface ParsedFooterContent {
  eyebrow: string;
  headline: string;
  copyright: string;
  links: Array<{ label: string; href: string }>;
  ctaLinks: Array<{ label: string; href: string }>;
  socialIcons: Array<{ network: string; href: string }>;
}

export function getTemplateBySlug(slug: string): MigratedTemplate | undefined {
  return loadMigrated().templates.find((item) => item.slug === slug);
}

export function parseLogoFromTemplateHtml(html: string): string | null {
  const match = html.match(
    /class="logo desktop"[^>]*>\s*<img[^>]*\ssrc="([^"]+)"/i,
  );
  return match?.[1] ?? null;
}

export function parseFooterContent(html: string): ParsedFooterContent {
  const headings = [...html.matchAll(/thegem-heading[^>]*>([\s\S]*?)<\/div>/gi)]
    .map((m) =>
      m[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&#039;/g, "'")
        .trim(),
    )
    .filter(Boolean);

  const links: Array<{ label: string; href: string }> = [];
  const linkRe =
    /<a href="([^"]*)"[^>]*>\s*<span class="text">([^<]+)/gi;
  let linkMatch: RegExpExecArray | null;
  while ((linkMatch = linkRe.exec(html)) !== null) {
    const href = linkMatch[1].replace(/\/$/, "") || "/";
    const label = linkMatch[2].trim();
    if (label && !links.some((l) => l.label === label && l.href === href)) {
      links.push({ label, href });
    }
  }

  const copyright =
    headings.find((h) => /copyright/i.test(h)) ??
    `Copyright ${new Date().getFullYear()} © Dame Luthas`;

  const ctaLabels = ["Let's Chat", "Email Me", "Book Meeting"];
  const ctaLinks = ctaLabels.map((label) => {
    const normalized = label.toLowerCase();
    if (normalized.includes("email")) {
      return { label, href: "mailto:" };
    }
    if (normalized.includes("meeting") || normalized.includes("chat")) {
      return { label, href: "/contact" };
    }
    return { label, href: "/contact" };
  });

  const socialNetworks = [
    "facebook",
    "twitter",
    "pinterest",
    "linkedin",
    "youtube",
  ] as const;
  const socialIcons = socialNetworks.map((network) => ({
    network,
    href: "",
  }));

  return {
    eyebrow: headings.find((h) => /thanks for your time/i.test(h)) ?? "",
    headline:
      headings.find((h) => /hear from you/i.test(h)) ?? "I'd Love to Hear From You.",
    copyright,
    links,
    ctaLinks,
    socialIcons,
  };
}
