"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { MigratedPortfolioItem } from "@/shared/lib/migrated/content";

import { PortfolioFilterMenu } from "./PortfolioFilterMenu";

interface PortfolioGridProps {
  items: MigratedPortfolioItem[];
  title?: string;
  /** WP thegem-portfolio preset: 2 columns on desktop. */
  columns?: "2" | "3";
  id?: string;
}

export function PortfolioGrid({
  items,
  title = "Portfolio",
  columns = "3",
  id,
}: PortfolioGridProps) {
  const filterLabels = useMemo(
    () => ["All", ...items.map((item) => item.title)],
    [items],
  );
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".dl-gem-item-reveal");
    if (!nodes.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      nodes.forEach((node) => node.classList.add("dl-gem-item-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("dl-gem-item-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [activeFilter, items]);

  const visibleItems =
    activeFilter === "All"
      ? items
      : items.filter((item) => item.title === activeFilter);

  return (
    <section id={id} className="mx-auto max-w-[var(--dl-container-max)] px-[21px] py-12">
      <h2 className="mb-8 text-3xl font-semibold uppercase tracking-wide text-white">
        {title}
      </h2>

      <PortfolioFilterMenu
        labels={filterLabels}
        active={activeFilter}
        onSelect={setActiveFilter}
      />

      <nav
        className="mb-8 hidden flex-wrap gap-3 md:flex"
        aria-label="Portfolio filters"
      >
        {filterLabels.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setActiveFilter(label)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              label === activeFilter
                ? "bg-[var(--dl-accent)] text-white"
                : "border border-white/15 text-zinc-300 hover:border-[var(--dl-accent)]"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div
        className={`grid gap-6 ${columns === "2" ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}
      >
        {visibleItems.map((item) => (
          <article
            key={item.id}
            className="dl-gem-portfolio-card dl-gem-item-reveal group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            {item.image ? (
              <div className="dl-gem-portfolio-card__image relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                />
                <div className="dl-gem-overlay-circle pointer-events-none" aria-hidden />
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
