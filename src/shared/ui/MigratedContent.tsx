import { rewriteWpMediaUrls } from "@/shared/lib/headless/rewrite-media";

interface MigratedContentProps {
  html: string;
  className?: string;
}

/** Renders sanitized migrated HTML with media URLs rewritten to /assets/{domain}/. */
export function MigratedContent({ html, className }: MigratedContentProps) {
  if (!html) return null;
  const safe = rewriteWpMediaUrls(html);
  return (
    <div
      className={
        className ??
        "migrated-content space-y-4 text-zinc-300 [&_a]:text-[var(--dl-accent)] [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-white [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-xl [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed [&_strong]:text-white [&_ul]:space-y-2"
      }
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}

/** Rewrite stored /api/wp-media/ or wp-content paths on image src fields. */
export function rewriteMigratedMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  return rewriteWpMediaUrls(url);
}
