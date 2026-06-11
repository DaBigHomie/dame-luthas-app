import Image from "next/image";
import Link from "next/link";

import { loadMigrated } from "@/shared/lib/migrated/content";

export function Hero() {
  const { hero } = loadMigrated();

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--dl-accent)]">
          {hero.eyebrow}
        </p>
        <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
          {hero.title}
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-zinc-300">
          {hero.subtitle}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href={hero.ctaPrimary.href}
            className="rounded-full bg-[var(--dl-accent)] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            {hero.ctaPrimary.label}
          </Link>
          <Link
            href={hero.ctaSecondary.href}
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:border-[var(--dl-accent)]"
          >
            {hero.ctaSecondary.label}
          </Link>
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
