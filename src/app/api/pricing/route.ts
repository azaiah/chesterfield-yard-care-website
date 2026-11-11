import { NextResponse } from "next/server";
import { getPriceBook } from "@/lib/server/portal";

export const runtime = "nodejs";
export const revalidate = 300;

/** Public: the owner's price book for the instant estimator (falls back to sample ranges). */
export async function GET() {
  const { book, custom } = await getPriceBook();
  return NextResponse.json({ book, custom });
}
