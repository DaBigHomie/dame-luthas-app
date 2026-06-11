/** Strip WP/Elementor noise; keep readable HTML for migration. */
export function sanitizeWpHtml(html: string): string {
  if (!html) return "";
  let out = html;
  out = out.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  out = out.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<form[^>]*>[\s\S]*?<\/form>/gi, "");
  out = out.replace(/<!DOCTYPE[\s\S]*?<\/html>/gi, "");
  out = out.replace(/\t/g, "");
  out = out.replace(/data-[a-z-]+="[^"]*"/gi, "");
  out = out.replace(/class="elementor[^"]*"/gi, "");
  out = out.replace(/javascript:\s*void\(0\)/gi, "#");
  out = out.replace(
    /https?:\/\/dameluthas\.local\/wp-content\/uploads\//gi,
    "/api/wp-media/",
  );
  out = out.replace(
    /https?:\/\/dameluthas-com-restore\.local\/wp-content\/uploads\//gi,
    "/api/wp-media/",
  );
  out = out.replace(/\/wp-content\/uploads\//gi, "/api/wp-media/");
  out = out.replace(/https?:\/\/dameluthas\.local/gi, "");
  out = out.replace(/https?:\/\/dameluthas-com-restore\.local/gi, "");
  // SQL dump parser often leaves literal "n" where newlines were escaped.
  out = out.replace(/>\s*n\s*/g, ">\n");
  out = out.replace(/\s*n\s*</g, "\n<");
  out = out.replace(/([.!?])\s*n\s+/g, "$1\n");
  return out.trim();
}

export function htmlToPlainText(html: string): string {
  return sanitizeWpHtml(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerptFromHtml(html: string, max = 220): string {
  const text = htmlToPlainText(html);
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}
