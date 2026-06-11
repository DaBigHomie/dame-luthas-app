import Link from "next/link";

import type { ParsedFooterContent } from "@/shared/lib/migrated/templates";

interface FooterBottomBarProps {
  footer: ParsedFooterContent;
  site: { contact: { email: string; linkedin: string } };
  navigation: Array<{ label: string; href: string }>;
}

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  twitter: "Twitter",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

function SocialIcon({ network }: { network: string }) {
  const common = "h-4 w-4 fill-current";

  switch (network) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path d="M14 8h3V5h-3c-2.8 0-4 1.7-4 4v2H7v3h3v7h3v-7h2.8l.2-3H13v-2c0-.6.4-1 1-1z" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path d="M18.2 4h3.5l-7.6 8.7L22 20h-6.7l-4.2-5.5L5.8 20H2.3l8.1-9.3L2 4h6.9l3.8 5 4.5-5zm-1.2 14h1.9L7.1 5.9H5.1l11.9 12.1z" />
        </svg>
      );
    case "pinterest":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path d="M12 2a10 10 0 0 0-3.6 19.4c-.1-.8-.2-2 .1-3 0 0 .3-1.2.3-1.2s-.2-.4-.2-1c0-.9.5-1.6 1.2-1.6.6 0 .8.4.8 1 0 .6-.4 1.5-.6 2.3-.2.7.4 1.2 1 1.2 1.2 0 2.1-1.3 2.1-3.2 0-1.7-1.2-2.9-3-2.9-2 0-3.2 1.5-3.2 3.1 0 .6.2 1.3.6 1.6.1 0 .1 0 .1-.1l.2-.8c0-.1 0-.2-.1-.3-.2-.3-.3-.7-.3-1.1 0-1.4 1-2.5 2.6-2.5 1.4 0 2.2 1 2.2 2.4 0 1.4-.6 2.6-1.4 2.6-.5 0-.8-.4-.7-1 0-.3.2-1 .3-1.3 0-.2-.1-.4-.4-.4-.3 0-.6.3-.6.8 0 .3.1.5.1.5l-.2.9c-.1.3-.1.5-.2.7-.1.4-.3.8-.3 1.1 0 .4.3.7.7.7 1.5 0 2.7-1.6 2.7-3.9C16.4 6.8 14.5 5 12 5 8.8 5 6.5 7.5 6.5 10.8c0 1.3.5 2.7 1.2 3.2.1.1.1 0 .1-.1l.5-2c0-.1 0-.2-.1-.3-.3-.7-.5-1.5-.5-2.3 0-2.2 1.6-4 3.9-4 2.1 0 3.3 1.3 3.3 3.2 0 2.1-1.1 3.7-2.7 3.7-.5 0-1-.4-1-1.1 0-.2 0-.4.1-.7l.4-1.5c.1-.4.2-.8.2-1.1 0-.4-.2-.7-.6-.7-.5 0-.9.5-.9 1.2 0 .4.1.8.1.8l-.4 1.6c-.1.5-.2.9-.2 1.2 0 .8.4 1.3 1.1 1.3 1.4 0 2.5-1.5 2.5-3.6C14.8 8.1 13.6 7 12 7z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path d="M6.5 8.5h3v10h-3v-10zm1.5-4.5a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zm4 4.5h2.9v1.4h.1c.4-.8 1.5-1.6 3.1-1.6 3.3 0 3.9 2.2 3.9 5v5.2h-3v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.7h-3V8.5z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18 5 12 5 12 5s-6 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C6 19 12 19 12 19s6 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8 26 26 0 0 0 .4-4.8 26 26 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
        </svg>
      );
    default:
      return null;
  }
}

function resolveCtaHref(
  label: string,
  contact: { phone: string; email: string; linkedin: string },
): string {
  const key = label.toLowerCase();
  if (key.includes("email")) return `mailto:${contact.email}`;
  if (key.includes("chat")) return "/contact";
  if (key.includes("meeting")) return contact.linkedin || "/contact";
  return "/contact";
}

function resolveSocialHref(
  network: string,
  contact: { linkedin: string },
): string | null {
  if (network === "linkedin" && contact.linkedin) return contact.linkedin;
  return null;
}

export function FooterBottomBar({
  footer,
  site,
  navigation,
}: FooterBottomBarProps) {
  const navLinks =
    footer.links.length > 0
      ? footer.links.filter((item) =>
          navigation.some(
            (nav) => nav.href === item.href || nav.label === item.label,
          ),
        )
      : navigation;

  const ctaLinks = footer.ctaLinks.map((item) => ({
    ...item,
    href: resolveCtaHref(item.label, site.contact),
  }));

  const socialItems = footer.socialIcons
    .map((item) => ({
      ...item,
      href: resolveSocialHref(item.network, site.contact),
    }))
    .filter((item) => item.href);

  return (
    <>
      <div className="dl-gem-footer-bar border-y border-black/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <nav
            className="dl-gem-footer-bar__nav"
            aria-label="Footer navigation"
          >
            {navLinks.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="dl-gem-footer-bar__nav-link dl-gem-nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-6">
            {ctaLinks.map((item) =>
              item.href.startsWith("mailto:") ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="dl-gem-footer-bar__cta-link dl-gem-nav-link"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="dl-gem-footer-bar__cta-link dl-gem-nav-link"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-500">
            {footer.copyright.replace(/Dame Luthas/i, site.name)}
          </p>
          {socialItems.length > 0 ? (
            <div className="dl-gem-social-row" role="list">
              {socialItems.map((item) => (
                <a
                  key={item.network}
                  href={item.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="listitem"
                  aria-label={SOCIAL_LABELS[item.network] ?? item.network}
                  className="dl-gem-social-icon"
                >
                  <SocialIcon network={item.network} />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
