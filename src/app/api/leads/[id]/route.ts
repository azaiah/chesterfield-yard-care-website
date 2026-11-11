import { after, NextResponse, type NextRequest } from "next/server";
import { checkToken, getLead, MAX_PHOTOS, savePhoto, step2Schema, updateLead } from "@/lib/server/leads";
import { notifyLeadDetails } from "@/lib/server/notify";

export const runtime = "nodejs";

/** Step 2 (optional): services, photos, timing, notes, contact preference — multipart/form-data. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ ok: false, error: "Invalid form" }, { status: 400 });
  if (!checkToken(id, String(form.get("token") ?? ""))) return NextResponse.json({ ok: false, error: "Not allowed" }, { status: 403 });

  const parsed = step2Schema.safeParse({
    services: form.getAll("services").map(String),
    timing: form.get("timing") || undefined,
    notes: form.get("notes") || undefined,
    contactPref: form.get("contactPref") || undefined,
    email: form.get("email") || undefined,
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ ok: false, field: issue?.path[0], error: issue?.message }, { status: 400 });
  }

  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0).slice(0, MAX_PHOTOS);
  const photos: string[] = [];
  try {
    for (const f of files) photos.push(await savePhoto(id, f));
  } catch (e) {
    return NextResponse.json({ ok: false, field: "photos", error: (e as Error).message }, { status: 400 });
  }

  const existing = await getLead(id);
  const d = parsed.data;
  const patch = {
    services: Array.from(new Set([...(existing?.services ?? []), ...d.services])),
    timing: d.timing ?? null,
    notes: d.notes ?? null,
    contact_pref: d.contactPref,
    email: d.email || null,
    photos: [...(existing?.photos ?? []), ...photos],
  };
  await updateLead(id, patch).catch((e) => console.error("[leads] update failed", e));
  if (existing) after(() => notifyLeadDetails({ ...existing, ...patch }));
  return NextResponse.json({ ok: true });
}
