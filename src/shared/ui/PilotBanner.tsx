import type { HeadlessMode } from "@/shared/lib/headless/types";

interface PilotBannerProps {
  mode: HeadlessMode;
  portfolioCount: number;
  pageCount: number;
}

export function PilotBanner({ mode, portfolioCount, pageCount }: PilotBannerProps) {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-950">
      <strong>Headless pilot</strong> — mode:{" "}
      <code className="rounded bg-amber-100 px-1">{mode}</code> · {portfolioCount}{" "}
      portfolio · {pageCount} pages ·{" "}
      {mode === "snapshot"
        ? "serving SQL snapshot (no WP host)"
        : "live WPGraphQL"}
    </div>
  );
}
