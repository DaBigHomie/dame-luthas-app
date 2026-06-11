import Image from "next/image";

import type { MigratedPortfolioItem } from "@/shared/lib/migrated/content";
import { parsePortfolioBody } from "@/shared/lib/migrated/parse-portfolio-body";
import type { PortfolioNavLink } from "@/shared/types/portfolio-widgets";
import { rewriteMigratedMediaUrl } from "@/shared/ui/MigratedContent";

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
  const { gallery, skills, strippedHtml } = parsePortfolioBody(item.bodyHtml);

  return (
    <main className="mx-auto max-w-[var(--dl-container-max)] px-6 py-12">
      <PortfolioInfo backHref="/portfolio" backLabel="Portfolio" />

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

      {gallery.length > 0 ? (
        <section className="mt-10" aria-label="Gallery">
          <GalleryGrid items={gallery} />
        </section>
      ) : null}

      <Diagram skills={skills} />

      <PortfolioContent html={strippedHtml} />
      <PortfolioNav prev={prev} next={next} />
    </main>
  );
}
