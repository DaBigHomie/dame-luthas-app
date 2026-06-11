import type { CheerioAPI } from "cheerio";

import type { Testimonial } from "../../../../src/content/types";
import { cleanText } from "./normalize-url";

/** Collect testimonial post IDs from rendered homepage HTML. */
export function parseTestimonialPostIds($: CheerioAPI): number[] {
  const ids: number[] = [];
  $(".gem-testimonial-item[id]").each((_, el) => {
    const id = Number.parseInt($(el).attr("id") ?? "", 10);
    if (Number.isFinite(id)) ids.push(id);
  });
  return ids;
}

const TESTIMONIAL_BY_ID = `
query TestimonialById($id: ID!) {
  thegemTestimonial(id: $id, idType: DATABASE_ID) {
    databaseId
    title
    testimonialQuote
    testimonialRole
    elementorData
    excerpt
  }
}`;

interface TestimonialNode {
  databaseId: number;
  title: string | null;
  testimonialQuote: string | null;
  testimonialRole: string | null;
  elementorData: string | null;
  excerpt: string | null;
}

export async function fetchTestimonialsByIds(
  query: <T>(gql: string, variables?: Record<string, unknown>) => Promise<T>,
  ids: number[],
): Promise<Testimonial[]> {
  const items: Testimonial[] = [];

  for (const id of ids) {
    try {
      const data = await query<{ thegemTestimonial: TestimonialNode | null }>(
        TESTIMONIAL_BY_ID,
        { id },
      );
      const node = data.thegemTestimonial;
      if (!node) continue;

      const quote =
        cleanText(node.testimonialQuote ?? "") ||
        cleanText(node.excerpt ?? "") ||
        "";
      const author = cleanText(node.title ?? "");
      if (!quote || !author || quote.endsWith("…")) continue;

      items.push({
        quote,
        author,
        role: cleanText(node.testimonialRole ?? "") || undefined,
      });
    } catch {
      // skip unavailable nodes
    }
  }

  return items;
}
