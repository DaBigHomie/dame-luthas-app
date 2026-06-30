import Link from "next/link";

import { listPortfolio } from "@/shared/lib/migrated/content";
import { PortfolioGrid } from "@/widgets/PortfolioGrid";

export function CaseStudiesPage() {
  const items = listPortfolio();

  return (
    <main>
      <section className="mx-auto max-w-[var(--dl-container-max)] px-6 pb-4 pt-16 md:pt-20">
        <p className="text-sm text-zinc-500">
          <Link href="/" className="hover:text-[var(--dl-accent)]">
            Home
          </Link>
          <span className="mx-2">→</span>
          <span className="text-[var(--dl-accent)]">Case Studies</span>
        </p>
        <h1 className="title-h1 mt-6 text-4xl font-semibold text-white md:text-5xl">
          Case Studies
        </h1>
        <p className="styled-subtitle mt-4 max-w-3xl text-lg leading-relaxed text-zinc-400">
          Our clients come to me with their toughest challenges — from global
          cloud transformation to grassroots digital infrastructure. Explore
          selected work below.
        </p>
      </section>

      <PortfolioGrid items={items} showHeading={false} columns="3" />
    </main>
  );
}
