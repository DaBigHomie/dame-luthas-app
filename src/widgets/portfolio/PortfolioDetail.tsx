import Image from "next/image";
import Link from "next/link";

import type { MigratedPortfolioItem } from "@/shared/lib/migrated/content";
import { resolveCaseStudy } from "@/shared/lib/migrated/resolve-case-study";
import type { PortfolioNavLink } from "@/shared/types/portfolio-widgets";
import { rewriteMigratedMediaUrl } from "@/shared/ui/MigratedContent";
import { TestimonialsCarousel } from "@/widgets/home/TestimonialsCarousel";

import { Diagram } from "./Diagram";
import { GalleryGrid } from "./GalleryGrid";
import { PortfolioContent } from "./PortfolioContent";
import { PortfolioExcerpt } from "./PortfolioExcerpt";
import { PortfolioInfo } from "./PortfolioInfo";
import { PortfolioNav } from "./PortfolioNav";
import { PortfolioTitle } from "./PortfolioTitle";

interface PortfolioDetailProps {
  item: MigratedPortfolioItem;
  prev?: PortfolioNavLink | null;
  next?: PortfolioNavLink | null;
}

export function PortfolioDetail({ item, prev, next }: PortfolioDetailProps) {
  const resolved = resolveCaseStudy(item);
  const meta = [
    ...(resolved.client ? [{ label: "Client", value: resolved.client }] : []),
    ...(resolved.sectors.length
      ? [{ label: "Sector", value: resolved.sectors.join(", ") }]
      : []),
    ...(resolved.year ? [{ label: "Year", value: resolved.year }] : []),
  ];

  return (
    <main className="mx-auto max-w-[var(--dl-container-max)] px-6 py-12">
      <PortfolioInfo backHref="/case-studies" backLabel="Case Studies" meta={meta} />

      {item.image ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-white/10">
          <Image
            src={rewriteMigratedMediaUrl(item.image)}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
            unoptimized
          />
        </div>
      ) : null}

      <header className="mt-8 space-y-4">
        <PortfolioTitle title={item.title} />
        <PortfolioExcerpt excerpt={item.excerpt} />
      </header>

      {resolved.gallery.length > 0 ? (
        <section className="mt-10" aria-label="Gallery">
          <GalleryGrid items={resolved.gallery} />
        </section>
      ) : null}

      <Diagram skills={resolved.skills} />

      <PortfolioContent html={resolved.proseHtml} />

      {resolved.testimonials.length > 0 ? (
        <TestimonialsCarousel
          items={resolved.testimonials}
          title="Client Feedback"
        />
      ) : null}

      {resolved.cta ? (
        <div className="mt-12 text-center">
          <Link
            href={resolved.cta.href}
            className="inline-flex rounded-full bg-[var(--dl-accent)] px-8 py-3 text-sm font-semibold uppercase text-white transition hover:opacity-90"
          >
            {resolved.cta.label}
          </Link>
        </div>
      ) : null}

      <PortfolioNav prev={prev} next={next} />
    </main>
  );
}
