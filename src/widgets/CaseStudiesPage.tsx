import Link from "next/link";

import {
  getPageBySlug,
  listPortfolio,
} from "@/shared/lib/migrated/content";
import { MigratedContent } from "@/shared/ui/MigratedContent";
import { PortfolioGrid } from "@/widgets/PortfolioGrid";

export function CaseStudiesPage() {
  const page = getPageBySlug("case-studies");
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
          {page?.title ?? "Case Studies"}
        </h1>
        {page?.excerpt ? (
          <p className="styled-subtitle mt-4 max-w-3xl text-lg leading-relaxed text-zinc-400">
            {page.excerpt.replace(/<[^>]+>/g, "").replace(/&#8217;/g, "'")}
          </p>
        ) : null}
      </section>

      <PortfolioGrid items={items} title="Case Studies" columns="3" />

      {page?.bodyHtml ? (
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <MigratedContent html={page.bodyHtml} />
        </section>
      ) : null}
    </main>
  );
}
