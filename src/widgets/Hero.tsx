import Image from "next/image";

import { heroFallback } from "@/content/hero-fallback";
import { isMigratedAvailable, loadMigrated } from "@/shared/lib/migrated/content";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";
import { AnimatedButton } from "@/shared/ui/AnimatedButton";

export function Hero() {
  const hero = isMigratedAvailable() ? loadMigrated().hero : heroFallback;

  return (
    <section className="mx-auto grid max-w-[var(--dl-container-max)] gap-10 px-[21px] py-16 md:grid-cols-2 md:items-center md:py-24">
      <div className="space-y-6">
        <AnimatedHeading
          as="p"
          text={hero.eyebrow}
          variant="fade-simple"
          className="text-sm uppercase tracking-[0.2em] text-[var(--dl-accent)]"
        />
        <AnimatedHeading
          as="h1"
          text={hero.title}
          variant="letters-slide-up"
          staggerMs={15}
          className="dl-typography-hero-h1 text-white"
        />
        <AnimatedHeading
          as="p"
          text={hero.subtitle}
          variant="words-slide-left"
          staggerMs={30}
          className="max-w-xl text-[length:clamp(18px,1.6vw,24px)] leading-relaxed text-[var(--text-muted)]"
        />
        <div className="flex flex-wrap gap-4">
          <AnimatedButton
            href={hero.ctaPrimary.href}
            variant="fade"
            className="dl-gem-btn-hover rounded-full bg-[var(--dl-accent)] px-6 py-3 text-sm font-medium text-white"
          >
            {hero.ctaPrimary.label}
          </AnimatedButton>
          <AnimatedButton
            href={hero.ctaSecondary.href}
            variant="fade-left"
            className="dl-gem-btn-hover rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:border-[var(--dl-accent)]"
          >
            {hero.ctaSecondary.label}
          </AnimatedButton>
        </div>
      </div>
      {hero.image ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={hero.image}
            alt="Dame Luthas"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        </div>
      ) : null}
    </section>
  );
}
