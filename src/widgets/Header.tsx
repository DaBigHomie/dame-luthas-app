import Image from "next/image";
import Link from "next/link";

import { headerNavigation, socialLinks } from "@/content";
import { isMigratedAvailable, loadMigrated } from "@/shared/lib/migrated/content";
import { AnimatedButton } from "@/shared/ui/AnimatedButton";
import { SocialIcons } from "@/shared/ui/SocialIcons";
import {
  getTemplateBySlug,
  parseLogoFromTemplateHtml,
} from "@/shared/lib/migrated/templates";

export function Header() {
  const migrated = isMigratedAvailable();
  const { site } = migrated
    ? loadMigrated()
    : {
        site: {
          name: "Dame Luthas",
          contact: { linkedin: socialLinks[0]?.href },
        },
      };
  const navigation = migrated ? loadMigrated().navigation : headerNavigation;
  const headerTemplate = migrated ? getTemplateBySlug("header-sticky") : null;
  const logoSrc = headerTemplate
    ? parseLogoFromTemplateHtml(headerTemplate.bodyHtml)
    : null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--dl-bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-[var(--dl-container-max)] items-center justify-between gap-6 px-[21px] py-4">
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
        <nav
          className="hidden flex-1 justify-center gap-6 text-sm text-zinc-300 md:flex"
          aria-label="Primary"
        >
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
          <SocialIcons links={socialLinks} className="hidden md:flex" />
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
