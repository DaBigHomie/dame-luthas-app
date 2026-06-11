import Image from "next/image";
import Link from "next/link";

import type { MigratedAboutPage } from "@/shared/lib/migrated/content";
import { loadMigrated } from "@/shared/lib/migrated/content";
import { IconList } from "@/widgets/contact/IconList";

interface AboutPageProps {
  about: MigratedAboutPage;
}

export function AboutPage({ about }: AboutPageProps) {
  const { site } = loadMigrated();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start">
        <div className="space-y-6">
          {about.image ? (
            <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={about.image}
                alt={about.headline}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 360px"
                unoptimized
              />
            </div>
          ) : null}
          <div className="text-center md:text-left">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--dl-accent)]">
              {about.title}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
              {about.headline}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">{about.role}</p>
          </div>
        </div>

        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-zinc-300">{about.bio}</p>

          {about.address ? (
            <div className="rounded-2xl border border-white/10 bg-[var(--dl-surface)] p-6">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-400">
                Location
              </h2>
              <IconList
                items={[
                  {
                    icon: "pin",
                    text: `${about.address.line1}, ${about.address.line2}`,
                  },
                ]}
              />
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
              className="rounded-full border border-white/15 px-5 py-2.5 text-zinc-200 transition hover:border-[var(--dl-accent)] hover:text-white"
            >
              {site.contact.phone}
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="rounded-full border border-white/15 px-5 py-2.5 text-zinc-200 transition hover:border-[var(--dl-accent)] hover:text-white"
            >
              {site.contact.email}
            </a>
            <Link
              href="/contact"
              className="rounded-full bg-[var(--dl-accent)] px-5 py-2.5 font-medium text-white transition hover:opacity-90"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
