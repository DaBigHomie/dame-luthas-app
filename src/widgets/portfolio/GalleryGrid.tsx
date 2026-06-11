"use client";

import Image from "next/image";
import { useState } from "react";

import type { GalleryItem } from "@/shared/types/portfolio-widgets";

interface GalleryGridProps {
  items: GalleryItem[];
  className?: string;
}

export function GalleryGrid({ items, className }: GalleryGridProps) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  if (!items.length) return null;

  return (
    <>
      <div
        className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 ${className ?? ""}`}
        role="list"
        aria-label="Project gallery"
      >
        {items.map((item) => (
          <button
            key={item.fullSrc}
            type="button"
            role="listitem"
            className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/40"
            onClick={() => setActive(item)}
            aria-label={item.alt || "Open gallery image"}
          >
            <Image
              src={item.thumbSrc}
              alt={item.alt}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
              unoptimized
            />
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery preview"
          onClick={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setActive(null);
          }}
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-zinc-400 hover:text-white"
            onClick={() => setActive(null)}
            aria-label="Close preview"
          >
            Close
          </button>
          <div className="relative max-h-[85vh] max-w-5xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.fullSrc}
              alt={active.alt}
              className="max-h-[85vh] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
