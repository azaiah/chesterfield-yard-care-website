import { NextResponse, type NextRequest } from "next/server";
import { getFile } from "@/lib/server/db";
import { publicWork } from "@/lib/server/portal";

export const runtime = "nodejs";

/** Public gallery image — only served if the owner marked it public in the portal. */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") ?? "";
  const allowed = (await publicWork()).some((w) => w.photos.some((p) => p.key === key));
  if (!allowed) return new NextResponse("Not found", { status: 404 });
  const f = await getFile(key);
  if (!f) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(Buffer.from(f.body), { headers: { "Content-Type": f.type, "Cache-Control": "public, max-age=86400" } });
}
