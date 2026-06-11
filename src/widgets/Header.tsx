import Image from "next/image";
import Link from "next/link";

import { isMigratedAvailable, loadMigrated } from "@/shared/lib/migrated/content";
import { AnimatedButton } from "@/shared/ui/AnimatedButton";
import {
  getTemplateBySlug,
  parseLogoFromTemplateHtml,
} from "@/shared/lib/migrated/templates";

export function Header() {
  const migrated = isMigratedAvailable();
  const { site, navigation } = migrated
    ? loadMigrated()
    : {
        site: {
          name: "Dame Luthas",
          contact: { linkedin: "https://www.linkedin.com/in/dameluthas/" },
        },
        navigation: [
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/portfolio" },
          { label: "Contact", href: "/contact" },
        ],
      };
  const headerTemplate = migrated ? getTemplateBySlug("header-sticky") : null;
  const logoSrc = headerTemplate
    ? parseLogoFromTemplateHtml(headerTemplate.bodyHtml)
    : null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--dl-bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={site.name}
              width={132}
              height={40}
              className="h-8 w-auto"
              unoptimized
            />
          ) : (
            <span className="text-lg font-semibold tracking-tight text-white">
              {site.name}
            </span>
          )}
        </Link>
        <nav className="hidden flex-1 justify-center gap-6 text-sm text-zinc-300 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="dl-gem-nav-link transition hover:text-[var(--dl-accent)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {site.contact.linkedin ? (
            <a
              href={site.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-zinc-400 transition hover:text-[var(--dl-accent)] md:inline-flex"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                <path d="M6.5 8.5h3v10h-3v-10zm1.5-4.5a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zm4 4.5h2.9v1.4h.1c.4-.8 1.5-1.6 3.1-1.6 3.3 0 3.9 2.2 3.9 5v5.2h-3v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.7h-3V8.5z" />
              </svg>
            </a>
          ) : null}
          <AnimatedButton
            href="/contact"
            variant="fade-left"
            className="dl-gem-btn-hover hidden rounded-full bg-[var(--dl-accent)] px-5 py-2 text-sm font-medium text-white md:inline-flex"
          >
            Let&apos;s talk
          </AnimatedButton>
        </div>
      </div>
    </header>
  );
}
