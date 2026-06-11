"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export interface HeaderNavItem {
  label: string;
  href: string;
}

interface HeaderNavProps {
  items: HeaderNavItem[];
}

export function HeaderNav({ items }: HeaderNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!items.length) return null;

  return (
    <>
      <nav
        className="hidden flex-1 justify-center gap-6 text-sm text-zinc-300 lg:flex"
        aria-label="Primary"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="dl-gem-nav-link whitespace-nowrap transition hover:text-[var(--dl-accent)]"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="inline-flex items-center rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-200 lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-primary-nav"
        onClick={() => setOpen((value) => !value)}
      >
        Menu
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] bg-black/70 lg:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      ) : null}

      <nav
        id="mobile-primary-nav"
        className={`fixed right-0 top-0 z-[70] flex h-full w-[min(100%,20rem)] flex-col gap-1 border-l border-white/10 bg-[var(--dl-bg)] p-6 pt-20 shadow-xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        aria-label="Primary mobile"
        aria-hidden={!open}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="dl-gem-nav-link rounded-lg px-3 py-3 text-base text-zinc-200 hover:bg-white/5 hover:text-[var(--dl-accent)]"
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
