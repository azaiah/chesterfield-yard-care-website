import type { Metadata } from "next";
import { share } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Terms", ...share("/terms") };

// Plain-language starter terms. Have the owner review before launch.
export default function Terms() {
  return (
    <div className="container-x max-w-3xl space-y-5 py-16 md:py-24">
      <h1 className="h-display text-5xl">Terms of use</h1>
      <p className="text-sm text-[var(--muted)]">Last updated November 11, 2026</p>
      <h2 className="h-display text-2xl">Estimates</h2>
      <p>Prices shown by the online estimator are sample ranges for planning only. They are not a quote or an offer. Your actual price is confirmed after we review your yard.</p>
      <h2 className="h-display text-2xl">Quotes and scheduling</h2>
      <p>A quote becomes an agreement only once you accept it. Weather can move service days; we&apos;ll let you know when it does.</p>
      <h2 className="h-display text-2xl">Photos</h2>
      <p>Photos you send are used to quote and plan your job. We won&apos;t publish them without your permission.</p>
      <h2 className="h-display text-2xl">Contact</h2>
      <p>Questions? Call or text {SITE.phone}.</p>
    </div>
  );
}
