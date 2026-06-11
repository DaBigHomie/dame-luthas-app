import type { GraphQLClient } from "../graphql-client";
import type { Testimonial } from "../../../../src/content/types";
import { cleanText } from "./normalize-url";

const TESTIMONIALS_QUERY = `{
  dameluthasTestimonialQuotes {
    databaseId
    author
    quote
    role
  }
}`;

interface TestimonialQuoteNode {
  databaseId: number;
  author: string | null;
  quote: string | null;
  role: string | null;
}

export async function fetchTestimonialsFromGraphQL(
  client: GraphQLClient,
): Promise<Testimonial[] | null> {
  try {
    const data = await client.query<{
      dameluthasTestimonialQuotes: TestimonialQuoteNode[];
    }>(TESTIMONIALS_QUERY);

    const items = data.dameluthasTestimonialQuotes ?? [];
    if (!items.length) return null;

    return items
      .map((node) => {
        const quote = cleanText(node.quote ?? "");
        const author = cleanText(node.author ?? "");
        if (!quote || !author) return null;
        const item: Testimonial = {
          quote,
          author,
          role: cleanText(node.role ?? "") || undefined,
        };
        return item;
      })
      .filter((item): item is Testimonial => item !== null);
  } catch {
    return null;
  }
}
