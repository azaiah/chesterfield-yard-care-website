import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import type { Op } from "@/lib/portal/types";
import { requireOwner } from "@/lib/server/auth";
import { opSchema, persistOp } from "@/lib/server/portal";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const denied = await requireOwner();
  if (denied) return denied;
  const parsed = opSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid change" }, { status: 400 });
  try {
    await persistOp(parsed.data as Op);
  } catch (e) {
    console.error("[portal] mutate", e);
    return NextResponse.json({ ok: false, error: "Couldn't save. Try again." }, { status: 500 });
  }
  // Gallery + estimator read portal data.
  if (parsed.data.op === "job.update" || parsed.data.op === "job.create") ["/", "/gallery"].forEach((p) => revalidatePath(p));
  return NextResponse.json({ ok: true });
}
