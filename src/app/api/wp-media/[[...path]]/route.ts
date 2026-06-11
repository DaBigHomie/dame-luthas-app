import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";

function uploadsRoot(): string {
  const local = path.join(process.cwd(), "local-wp/app/public/wp-content/uploads");
  if (existsSync(local)) return local;
  return path.join(process.cwd(), "temp/uploads");
}
const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
): Promise<NextResponse> {
  const { path: segments } = await context.params;
  if (!segments?.length) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const uploadsRootPath = uploadsRoot();
  const filePath = path.join(uploadsRootPath, ...segments);
  if (!filePath.startsWith(uploadsRootPath) || !existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const body = readFileSync(filePath);
  return new NextResponse(body, {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
