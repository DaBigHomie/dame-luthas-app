import Link from "next/link";

import {
  clientLogos,
  contentSections,
  rotatingPhrases,
  serviceCards,
  testimonials,
} from "@/content";
import type { ContentSection } from "@/content/types";
import {
  getPilotStatus,
  getSiteInfo,
  listPages,
  listPortfolio,
} from "@/shared/lib/headless/data-source";
import {
  isMigratedAvailable,
  loadMigrated,
} from "@/shared/lib/migrated/content";
import { PilotBanner } from "@/shared/ui/PilotBanner";
import { RichContent } from "@/shared/ui/RichContent";
import { Hero } from "@/widgets/Hero";
import {
  AdvisorSection,
  ClientLogosSection,
  CtaBandSection,
  ManifestoSection,
  PartnerIntroSection,
  RotatingHeadlineSection,
  ServiceCardsSection,
  TestimonialsSection,
} from "@/widgets/home";
import { PortfolioGrid } from "@/widgets/PortfolioGrid";

function sectionById(
  sections: readonly ContentSection[],
  id: string,
): ContentSection | undefined {
  return sections.find((section) => section.id === id);
}

export default async function HomePage() {
  if (isMigratedAvailable()) {
    const { portfolio } = loadMigrated();
    const partnerIntro = sectionById(contentSections, "partner-intro");
    const advisor = sectionById(contentSections, "un-advisor");
    const manifesto = sectionById(contentSections, "brand-manifesto");
    const ctaBand = sectionById(contentSections, "cta-band");

    return (
      <main>
        <Hero />
        {partnerIntro ? <PartnerIntroSection section={partnerIntro} /> : null}
        {advisor ? <AdvisorSection section={advisor} /> : null}
        <ServiceCardsSection columns={serviceCards} />
        <RotatingHeadlineSection phrases={rotatingPhrases} />
        {manifesto ? <ManifestoSection section={manifesto} /> : null}
        <ClientLogosSection logos={clientLogos} />
        <TestimonialsSection items={testimonials} />
        {ctaBand ? <CtaBandSection section={ctaBand} /> : null}
        <PortfolioGrid items={portfolio} title="Selected work" />
      </main>
    );
  }

  const [site, status, portfolio, pages] = await Promise.all([
    getSiteInfo(),
    getPilotStatus(),
    listPortfolio(),
    listPages(),
  ]);

  const home =
    pages.find((page) => page.slug === "home") ??
    pages.find((page) => page.slug === "dame-luthas") ??
    pages[0];

  return (
    <>
      <PilotBanner
        mode={status.mode}
        portfolioCount={status.portfolioCount}
        pageCount={status.pageCount}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-zinc-500">
            {site.title}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Dame Luthas — Headless Pilot
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600">
            Next.js frontend reading WordPress content via{" "}
            {status.mode === "live" ? "WPGraphQL" : "SQL snapshot"} — no
            Supabase extract pipeline.
          </p>
        </header>

        {home ? (
          <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-medium">{home.title}</h2>
            <RichContent html={home.content} />
          </section>
        ) : null}

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="mb-4 text-xl font-medium">Portfolio</h2>
            <ul className="space-y-2">
              {portfolio.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/portfolio/${item.slug}`}
                    className="text-blue-700 hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/portfolio"
              className="mt-4 inline-block text-sm font-medium text-zinc-700"
            >
              View all →
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="mb-4 text-xl font-medium">Pages</h2>
            <ul className="space-y-2">
              {pages.slice(0, 8).map((page) => (
                <li key={page.id}>
                  <Link
                    href={`/${page.slug}`}
                    className="text-blue-700 hover:underline"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
