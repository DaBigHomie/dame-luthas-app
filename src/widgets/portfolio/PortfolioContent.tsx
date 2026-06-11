import { MigratedContent } from "@/shared/ui/MigratedContent";

interface PortfolioContentProps {
  html: string;
  className?: string;
}

export function PortfolioContent({ html, className }: PortfolioContentProps) {
  if (!html) return null;
  return (
    <div className={className ?? "mt-8"}>
      <MigratedContent html={html} />
    </div>
  );
}
