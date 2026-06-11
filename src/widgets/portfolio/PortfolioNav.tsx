import Link from "next/link";

import type { PortfolioNavLink } from "@/shared/types/portfolio-widgets";

interface PortfolioNavProps {
  prev?: PortfolioNavLink | null;
  next?: PortfolioNavLink | null;
}

export function PortfolioNav({ prev, next }: PortfolioNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      className="mt-12 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-8 text-sm"
      aria-label="Portfolio navigation"
    >
      {prev ? (
        <Link href={prev.href} className="max-w-[45%] text-zinc-400 hover:text-[var(--dl-accent)]">
          <span className="block text-xs uppercase tracking-wide text-zinc-500">Previous</span>
          <span className="line-clamp-2">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="max-w-[45%] text-right text-zinc-400 hover:text-[var(--dl-accent)]"
        >
          <span className="block text-xs uppercase tracking-wide text-zinc-500">Next</span>
          <span className="line-clamp-2">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
