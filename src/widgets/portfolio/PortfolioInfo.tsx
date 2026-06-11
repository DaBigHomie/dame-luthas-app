import Link from "next/link";

interface PortfolioInfoProps {
  backHref?: string;
  backLabel?: string;
  meta?: Array<{ label: string; value: string }>;
}

export function PortfolioInfo({
  backHref = "/portfolio",
  backLabel = "Portfolio",
  meta = [],
}: PortfolioInfoProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
      <Link href={backHref} className="text-zinc-400 hover:text-[var(--dl-accent)]">
        ← {backLabel}
      </Link>
      {meta.length ? (
        <dl className="flex flex-wrap gap-4 text-zinc-500">
          {meta.map((row) => (
            <div key={row.label}>
              <dt className="sr-only">{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
