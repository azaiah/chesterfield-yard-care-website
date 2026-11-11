import type { Metadata } from "next";
import { share } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy", ...share("/privacy") };

// Plain-language starter policy. Have the owner review before launch.
export default function Privacy() {
  return (
    <div className="container-x max-w-3xl space-y-5 py-16 md:py-24">
      <h1 className="h-display text-5xl">Privacy policy</h1>
      <p className="text-sm text-[var(--muted)]">Last updated November 11, 2026</p>
      <h2 className="h-display text-2xl">What we collect</h2>
      <p>When you ask for a quote we collect your name, phone number, property address and anything else you choose to send: services, photos of your yard, timing, notes and email. We also record which page you came from and basic campaign information (like an ad or search link) so we know how people find us.</p>
      <h2 className="h-display text-2xl">How we use it</h2>
      <p>Only to respond to your request, quote and schedule work, and contact you about your service. We do not sell your information.</p>
      <h2 className="h-display text-2xl">Text messages</h2>
      <p>If you submit a quote request, we may text you about it. Message and data rates may apply. Reply STOP to opt out at any time, or HELP for help.</p>
      <h2 className="h-display text-2xl">Service providers</h2>
      <p>We use trusted providers to host the site, store requests, and send email and text messages. They only process data on our behalf. If analytics are enabled, they use cookies to measure site visits.</p>
      <h2 className="h-display text-2xl">Your choices</h2>
      <p>To see, correct or delete the information you sent us, call or text {SITE.phone}.</p>
    </div>
  );
}
