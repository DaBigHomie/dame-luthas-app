import { rewritePilotHtml } from "@/shared/lib/headless/rewrite-media";

interface RichContentProps {
  html: string;
  className?: string;
}

export function RichContent({ html, className }: RichContentProps) {
  const safe = rewritePilotHtml(html);
  return (
    <div
      className={
        className ??
        "wp-pilot-content thegem-elementor elementor elementor-page prose prose-zinc max-w-none"
      }
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
