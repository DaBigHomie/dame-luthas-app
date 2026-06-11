import { notFound } from "next/navigation";

import { getPortfolioBySlug } from "@/shared/lib/headless/data-source";
import {
  getPortfolioBySlug as getMigratedPortfolio,
  getPortfolioNeighbors,
  isMigratedAvailable,
} from "@/shared/lib/migrated/content";
import { RichContent } from "@/shared/ui/RichContent";
import { PortfolioDetail } from "@/widgets/portfolio/PortfolioDetail";

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const { slug } = await params;

  if (isMigratedAvailable()) {
    const item = getMigratedPortfolio(slug);
    if (!item) notFound();

    const { prev, next } = getPortfolioNeighbors(slug);
    return <PortfolioDetail item={item} prev={prev} next={next} />;
  }

  const item = await getPortfolioBySlug(slug);
  if (!item) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <RichContent html={item.content} />
    </main>
  );
}
