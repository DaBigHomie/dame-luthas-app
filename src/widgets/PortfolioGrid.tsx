"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { MigratedPortfolioItem } from "@/shared/lib/migrated/content";
import {
  buildPortfolioFilters,
} from "@/shared/lib/portfolio-labels";

import { PortfolioFilterMenu } from "./PortfolioFilterMenu";

interface PortfolioGridProps {
  items: MigratedPortfolioItem[];
  title?: string;
  /** When false, omit section h2 (page already has h1). */
  showHeading?: boolean;
  /** WP thegem-portfolio preset: 2 columns on desktop. */
  columns?: "2" | "3";
  id?: string;
}

export function PortfolioGrid({
  items,
  title = "Portfolio",
  showHeading = true,
  columns = "3",
  id,
}: PortfolioGridProps) {
  const filters = useMemo(() => buildPortfolioFilters(items), [items]);
  const filterLabels = useMemo(
    () => ["All", ...filters.map((option) => option.label)],
    [filters],
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

  const activeSlug =
    activeFilter === "All"
      ? null
      : filters.find((option) => option.label === activeFilter)?.slug;

  const visibleItems =
    activeSlug === null
      ? items
      : items.filter((item) => item.slug === activeSlug);

  function handleFilterSelect(label: string) {
    setActiveFilter(label);
  }

  return (
    <section id={id} className="mx-auto max-w-[var(--dl-container-max)] px-[21px] py-12">
      {showHeading ? (
        <h2 className="mb-8 text-3xl font-semibold uppercase tracking-wide text-white">
          {title}
        </h2>
      ) : null}

      <PortfolioFilterMenu
        labels={filterLabels}
        active={activeFilter}
        onSelect={handleFilterSelect}
        options={filters}
      />

      <nav
        className="mb-8 hidden flex-wrap gap-3 md:flex"
        aria-label="Portfolio filters"
      >
        <FilterButton label="All" active={activeFilter === "All"} onSelect={handleFilterSelect} />
        {filters.map((option) => (
          <FilterButton
            key={option.slug}
            label={option.label}
            active={activeFilter === option.label}
            ariaLabel={option.fullTitle}
            onSelect={handleFilterSelect}
          />
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

function FilterButton({
  label,
  active,
  ariaLabel,
  onSelect,
}: {
  label: string;
  active: boolean;
  ariaLabel?: string;
  onSelect: (label: string) => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      title={ariaLabel}
      onClick={() => onSelect(label)}
      className={`rounded-full px-4 py-2 text-sm transition ${
        active
          ? "bg-[var(--dl-accent)] text-white"
          : "border border-white/15 text-zinc-300 hover:border-[var(--dl-accent)]"
      }`}
    >
      {label}
    </button>
  );
}
