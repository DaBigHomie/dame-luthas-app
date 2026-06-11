interface PortfolioExcerptProps {
  excerpt: string;
  className?: string;
}

export function PortfolioExcerpt({ excerpt, className }: PortfolioExcerptProps) {
  if (!excerpt) return null;
  return (
    <p className={`styled-subtitle text-lg leading-relaxed text-zinc-400 ${className ?? ""}`}>
      {excerpt}
    </p>
  );
}
