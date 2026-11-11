import type { Metadata } from "next";
import Image from "next/image";
import { BRAND as B } from "@/lib/site";

export const metadata: Metadata = { title: "Owner Portal", robots: { index: false, follow: false } };

// Phase 3 replaces this with the real owner portal (sign-in, leads, jobs, photos).
export default function Portal() {
  return (
    <section className="band-dark py-24">
      <div className="container-x max-w-xl text-center">
        <Image src={`${B}/logo/logo-badge.svg`} alt="" width={96} height={96} className="mx-auto" />
        <h1 className="h-display mt-6 text-5xl">Owner portal</h1>
        <p className="mt-4 text-[var(--muted)]">Coming soon: leads, quotes, jobs and photos in one place.</p>
      </div>
    </section>
  );
}
