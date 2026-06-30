import type { MigratedPortfolioItem } from "@/shared/lib/migrated/content";

const SHORT_LABELS: Record<string, string> = {
  "amazon-labor-union-digital-transformation": "Amazon",
  "gatorade-embraces-generative-ai-powered-bottle-design": "Gatorade",
  "united-nations-cloud-migration-fobos": "UN",
};

export interface PortfolioFilterOption {
  slug: string;
  label: string;
  fullTitle: string;
}

export function portfolioShortLabel(item: MigratedPortfolioItem): string {
  return SHORT_LABELS[item.slug] ?? item.title.split(/\s+/).slice(0, 2).join(" ");
}

export function buildPortfolioFilters(
  items: MigratedPortfolioItem[],
): PortfolioFilterOption[] {
  return items.map((item) => ({
    slug: item.slug,
    label: portfolioShortLabel(item),
    fullTitle: item.title,
  }));
}
