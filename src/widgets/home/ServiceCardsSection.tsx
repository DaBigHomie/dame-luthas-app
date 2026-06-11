import Image from "next/image";

import type { ServiceCardColumn } from "@/content/types";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";

interface ServiceCardsSectionProps {
  columns: readonly ServiceCardColumn[];
}

export function ServiceCardsSection({ columns }: ServiceCardsSectionProps) {
  if (columns.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <AnimatedHeading
        as="h2"
        text="services"
        variant="fade-simple"
        className="mb-10 text-sm uppercase tracking-[0.25em] text-[var(--dl-accent)]"
      />
      <div className="grid gap-8 lg:grid-cols-3">
        {columns.map((column) => (
          <article
            key={column.id}
            className="thegem-menu-custom overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={column.image}
                alt={column.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                unoptimized
              />
            </div>
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">{column.title}</h3>
              <ul className="nav-menu-custom space-y-2">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="group flex items-center justify-between text-sm text-zinc-300 hover:text-white"
                    >
                      <span>{item.label}</span>
                      {item.description ? (
                        <span className="label title-h6 rounded bg-white/10 px-2 py-0.5 text-xs text-[var(--dl-accent)]">
                          {item.description}
                        </span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
