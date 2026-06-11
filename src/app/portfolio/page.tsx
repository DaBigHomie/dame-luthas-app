import Link from "next/link";

import { listPortfolio } from "@/shared/lib/headless/data-source";
import {
  isMigratedAvailable,
  listPortfolio as listMigratedPortfolio,
} from "@/shared/lib/migrated/content";
import { PortfolioGrid } from "@/widgets/PortfolioGrid";

export default async function PortfolioPage() {
  if (isMigratedAvailable()) {
    const items = listMigratedPortfolio();
    return (
      <main>
        <PortfolioGrid items={items} />
      </main>
    );
  }

  const items = await listPortfolio();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold">Portfolio</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-zinc-200 p-6 shadow-sm"
          >
            <h2 className="text-xl font-medium">
              <Link
                href={`/portfolio/${item.slug}`}
                className="hover:text-blue-700"
              >
                {item.title}
              </Link>
            </h2>
            {item.excerpt ? (
              <p className="mt-2 line-clamp-3 text-sm text-zinc-600">
                {item.excerpt.replace(/<[^>]+>/g, "")}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </main>
  );
}
