"use client";

import { useEffect, useState } from "react";

import type { ServiceCategory } from "@/content/types";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";

interface ServiceCardProps {
  category: ServiceCategory;
}

export function ServiceCard({ category }: ServiceCardProps) {
  const [rotateIndex, setRotateIndex] = useState(0);
  const hasRotating = category.rotating.length > 0;

  useEffect(() => {
    if (!hasRotating) return;
    const timer = window.setInterval(() => {
      setRotateIndex((i) => (i + 1) % category.rotating.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [category.rotating.length, hasRotating]);

  return (
    <article className="thegem-menu-custom thegem-menu-custom--vertical flex flex-col gap-4">
      <AnimatedHeading
        as="h3"
        text={category.title}
        variant="fade-simple"
        className="dl-typography-category text-white"
      />
      {hasRotating ? (
        <p className="thegem-heading thegem-heading-rotating min-h-[2rem] text-lg text-[var(--dl-accent)]">
          <span className="thegem-heading-rotating-text inline-block transition-opacity duration-500">
            {category.rotating[rotateIndex]}
          </span>
        </p>
      ) : null}
      <ul className="nav-menu-custom space-y-2">
        {category.items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href ?? "#"}
              className="group flex items-center justify-between gap-2 text-sm text-zinc-300 transition hover:text-white"
            >
              <span className="menu-item-text">{item.label}</span>
              {item.badge ? (
                <span className="menu-item-description rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--dl-accent)]">
                  {item.badge}
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
