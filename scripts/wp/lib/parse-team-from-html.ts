import { htmlToPlainText } from "./sanitize-html";

export interface ParsedTeamProfile {
  name: string;
  bio: string;
  image: string | null;
}

export interface ParsedAddress {
  line1: string;
  line2: string;
}

export function parseTeamFromHtml(html: string): ParsedTeamProfile {
  const bioMatch = html.match(/team-person-description[\s\S]*?<p>([\s\S]*?)<\/p>/i);
  const imgMatch = html.match(/team-person-image[\s\S]*?src="([^"]+)"/i);
  const nameMatch = html.match(/team-person-name[^>]*>([^<]+)/i);

  return {
    name: nameMatch?.[1]?.trim() || "Dame Luthas",
    bio: bioMatch ? htmlToPlainText(bioMatch[1]) : "",
    image: imgMatch?.[1] ?? null,
  };
}

export function parseAddressFromHtml(html: string): ParsedAddress | null {
  const brNormalized = html.replace(/<br\s*\/?>/gi, ", ");
  const plain = htmlToPlainText(brNormalized);
  const match = plain.match(
    /(\d+[^,\n]+(?:Blvd|Ave|Street|St)[^,\n]*),?\s*([^,\n]+),\s*(CA\s*\d{5})[^,]*,?\s*(United States)?/i,
  );

  if (match) {
    return {
      line1: match[1].trim(),
      line2: `${match[2].trim()}, ${match[3].trim()}${match[4] ? `, ${match[4].trim()}` : ""}`,
    };
  }

  const elCajon = plain.match(/(\d+\s+El Cajon Blvd[^,\n]*)/i);
  if (elCajon) {
    return {
      line1: elCajon[1].trim(),
      line2: "San Diego, CA 92104, United States",
    };
  }

  return null;
}
