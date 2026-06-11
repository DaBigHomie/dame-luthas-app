import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPortfolioBySlug } from "@/shared/lib/headless/data-source";
import {
  getPortfolioBySlug as getMigratedPortfolio,
  isMigratedAvailable,
} from "@/shared/lib/migrated/content";
import { MigratedContent } from "@/shared/ui/MigratedContent";
import { RichContent } from "@/shared/ui/RichContent";

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

    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/portfolio"
          className="text-sm text-zinc-400 hover:text-[var(--dl-accent)]"
        >
          ← Portfolio
        </Link>
        {item.image ? (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              unoptimized
            />
          </div>
        ) : null}
        <h1 className="mt-8 text-3xl font-semibold text-white">{item.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-400">
          {item.excerpt}
        </p>
        {item.bodyHtml ? (
          <div className="mt-8">
            <MigratedContent html={item.bodyHtml} />
          </div>
        ) : (
          <p className="mt-8 leading-relaxed text-zinc-300">{item.bodyText}</p>
        )}
      </main>
    );
  }

  const item = await getPortfolioBySlug(slug);
  if (!item) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <Link href="/portfolio" className="text-sm text-zinc-500 hover:underline">
        ← Portfolio
      </Link>
      <h1 className="mt-4 mb-8 text-3xl font-semibold">{item.title}</h1>
      <RichContent html={item.content} />
    </main>
  );
}
