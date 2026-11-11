import Image from "next/image";
import Link from "next/link";
import { BRAND as B } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="py-24">
      <div className="container-x max-w-xl text-center">
        <Image src={`${B}/illustrations/illo-leaf-pile.webp`} alt="" width={200} height={200} className="mx-auto" />
        <h1 className="h-display mt-6 text-6xl">Lost in <span className="accent">the leaves.</span></h1>
        <p className="mt-4 text-[var(--muted)]">That page isn&apos;t here. Let&apos;s get you back on track.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="cyc-btn cyc-btn--lime">Home</Link>
          <Link href="/quote" className="cyc-btn cyc-btn--electric">Free quote</Link>
        </div>
      </div>
    </section>
  );
}
