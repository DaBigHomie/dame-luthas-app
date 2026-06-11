import Image from "next/image";
import Link from "next/link";

import type { MigratedAboutPage } from "@/shared/lib/migrated/content";
import { loadMigrated } from "@/shared/lib/migrated/content";

interface ContactPageProps {
  title: string;
  about: MigratedAboutPage | null;
}

export function ContactPage({ title, about }: ContactPageProps) {
  const { site } = loadMigrated();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-semibold text-white md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-zinc-500">
          <Link href="/" className="hover:text-[var(--dl-accent)]">
            Home
          </Link>
          <span className="mx-2">→</span>
          <span className="text-[var(--dl-accent)]">{title}</span>
        </p>
      </div>

      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          Lets Build <span className="text-[var(--dl-accent)]">Something great</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          My experience uncovered new opportunities for tomorrow; and reinvigorated a
          clarity of vision and passion for empowering organizational, business, and
          technical harmonization.
        </p>
      </div>

      {about ? (
        <div className="mx-auto grid max-w-4xl gap-10 rounded-2xl border border-white/10 bg-[var(--dl-surface)] p-8 md:grid-cols-[220px_1fr] md:items-start md:p-10">
          {about.image ? (
            <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-full border-2 border-[var(--dl-accent)]/40 md:mx-0">
              <Image
                src={about.image}
                alt={about.headline}
                fill
                className="object-cover"
                sizes="192px"
                unoptimized
              />
            </div>
          ) : null}
          <div className="space-y-4 text-center md:text-left">
            <div>
              <h3 className="text-xl font-semibold text-white">{about.headline}</h3>
              <p className="text-sm text-zinc-400">{about.role}</p>
            </div>
            <p className="leading-relaxed text-zinc-300">{about.bio}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:justify-start">
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                className="text-[var(--dl-accent)] hover:underline"
              >
                {site.contact.phone}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="text-[var(--dl-accent)] hover:underline"
              >
                {site.contact.email}
              </a>
              <Link
                href={site.contact.linkedin}
                className="text-[var(--dl-accent)] hover:underline"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-12 text-center text-sm text-zinc-500">
        Use the contact form below to reach out directly.
      </p>
    </main>
  );
}
