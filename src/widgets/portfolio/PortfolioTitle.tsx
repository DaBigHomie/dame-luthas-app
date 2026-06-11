interface PortfolioTitleProps {
  title: string;
  className?: string;
}

export function PortfolioTitle({ title, className }: PortfolioTitleProps) {
  return (
    <h1
      className={`title-h1 text-3xl font-semibold text-white md:text-4xl ${className ?? ""}`}
    >
      {title}
    </h1>
  );
}
