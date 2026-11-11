import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { BRAND as B, SITE, SMS } from "@/lib/site";

export const metadata: Metadata = { title: "Thanks! We got your request", robots: { index: false, follow: false } };

export default async function Thanks({ searchParams }: { searchParams: Promise<{ n?: string }> }) {
  const n = (await searchParams).n?.replace(/[^\p{L}\p{M}' -]/gu, "").slice(0, 30);
  return (
    <section className="py-20 md:py-28">
      <div className="container-x max-w-2xl text-center">
        <Image src={`${B}/illustrations/illo-done.webp`} alt="" width={220} height={220} className="mx-auto" priority />
        <h1 className="h-display mt-6 text-5xl md:text-7xl">
          Got it{n ? `, ${n}` : ""}! <span className="accent text-royal-600 dark-hide">Talk soon.</span>
          <span className="accent text-lime-300 dark-show">Talk soon.</span>
        </h1>
        <p className="mt-5 text-lg text-[var(--muted)]">
          Your request is in. {SITE.name} will reach out shortly by text or phone from {SITE.phone}. Save the number so you know it&apos;s us.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={SMS} className="cyc-btn cyc-btn--electric"><MessageSquareText aria-hidden /> Text us photos</a>
          <Link href="/" className="cyc-btn border border-[var(--border)] text-[var(--heading)]">Back home</Link>
        </div>
      </div>
    </section>
  );
}
