import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import sharp from "sharp";
import { requireOwner } from "@/lib/server/auth";
import { getFile, putFile } from "@/lib/server/db";

export const runtime = "nodejs";

/** Owner uploads a job photo: normalized to a web-friendly WebP (EXIF rotation applied, metadata stripped). */
export async function POST(req: NextRequest) {
  const denied = await requireOwner();
  if (denied) return denied;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/")) return NextResponse.json({ ok: false, error: "Choose a photo" }, { status: 400 });
  if (file.size > 20 * 1024 * 1024) return NextResponse.json({ ok: false, error: "Photo must be under 20 MB" }, { status: 400 });
  try {
    const { data, info } = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    const key = `jobs/${randomUUID()}/${randomUUID()}.webp`;
    await putFile(key, data, "image/webp");
    return NextResponse.json({ ok: true, key, width: info.width, height: info.height });
  } catch (e) {
    console.error("[portal] photo", e);
    return NextResponse.json({ ok: false, error: "Couldn't read that photo (HEIC from older iPhones may need converting)." }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const denied = await requireOwner();
  if (denied) return denied;
  const key = req.nextUrl.searchParams.get("key") ?? "";
  const f = await getFile(key).catch(() => null);
  if (!f) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(Buffer.from(f.body), { headers: { "Content-Type": f.type, "Cache-Control": "private, max-age=3600" } });
}
