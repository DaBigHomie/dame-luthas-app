import Image from "next/image";

import { heroFallback } from "@/content/hero-fallback";
import { toHeroProfileImage } from "@/content/profile-image";
import { isMigratedAvailable, loadMigrated } from "@/shared/lib/migrated/content";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";
import { AnimatedButton } from "@/shared/ui/AnimatedButton";

export function Hero() {
  const migratedBundle = isMigratedAvailable() ? loadMigrated() : null;
  const migrated = migratedBundle?.hero ?? null;
  const heroImage = migratedBundle
    ? toHeroProfileImage(migratedBundle.aboutPage?.image ?? migrated?.image)
    : heroFallback.image;
  const hero = migrated
    ? {
        title: migrated.title,
        subtitle: migrated.subtitle,
        ctaPrimary: migrated.ctaPrimary,
        image: heroImage,
      }
    : heroFallback;

  return (
    <section className="mx-auto max-w-[var(--dl-container-max)] px-[21px] py-12 md:py-16">
      <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
        <div className="flex flex-col justify-center p-8 text-foreground md:p-12 lg:p-14">
          <AnimatedHeading
            as="h1"
            text={hero.title}
            variant="letters-slide-up"
            staggerMs={15}
            className="dl-typography-hero-h1 text-foreground"
          />
          <AnimatedHeading
            as="p"
            text={hero.subtitle}
            variant="words-slide-left"
            staggerMs={20}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          />
          <div className="mt-8">
            <AnimatedButton
              href={hero.ctaPrimary.href}
              variant="fade-left"
              className="gem-button inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase text-primary-foreground"
            >
              {hero.ctaPrimary.label}
            </AnimatedButton>
          </div>
        </div>
        {hero.image ? (
          <div className="relative min-h-[280px] overflow-hidden rounded-[2rem] md:min-h-full">
            <Image
              src={hero.image}
              alt="Dame Luthas"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
