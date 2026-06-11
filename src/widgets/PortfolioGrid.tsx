import Image from "next/image";
import Link from "next/link";

import type { MigratedPortfolioItem } from "@/shared/lib/migrated/content";

interface PortfolioGridProps {
  items: MigratedPortfolioItem[];
  title?: string;
}

export function PortfolioGrid({ items, title = "Portfolio" }: PortfolioGridProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="mb-8 text-3xl font-semibold text-white">{title}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-[var(--dl-accent)]/50"
          >
            {item.image ? (
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                />
              </div>
            ) : null}
            <div className="space-y-3 p-6">
              <h3 className="text-lg font-medium text-white">
                <Link href={item.href} className="hover:text-[var(--dl-accent)]">
                  {item.title}
                </Link>
              </h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
                {item.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
