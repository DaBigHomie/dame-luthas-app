import { readFileSync } from "node:fs";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";

import {
  WP_CONTENT_MIME,
  resolveWpContentFile,
} from "@/shared/lib/headless/wp-content-paths";

function rewriteCssAssetUrls(css: string): string {
  return css
    .replace(
      /https?:\/\/dameluthas-com-restore\.local\/wp-content\//gi,
      "/wp-content/",
    )
    .replace(/https?:\/\/dameluthas\.com\/wp-content\//gi, "/wp-content/");
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
): Promise<NextResponse> {
  const { path: segments } = await context.params;
  if (!segments?.length) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const resolved = resolveWpContentFile(segments);
  if (!resolved) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = path.extname(resolved.filePath).toLowerCase();
  let body = readFileSync(resolved.filePath);

  if (ext === ".css") {
    const text = rewriteCssAssetUrls(body.toString("utf8"));
    body = Buffer.from(text, "utf8");
  }

  return new NextResponse(body, {
    headers: {
      "Content-Type": WP_CONTENT_MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
