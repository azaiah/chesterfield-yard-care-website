import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { ElectricButton, HeroMedia, LimeButton, ServiceBadges } from "@/components/brand/CycUI";
import { SMS } from "@/lib/site";

// Phase 1 holding page — the full conversion homepage lands in Phase 2.
export default function Home() {
  return (
    <>
      <section className="relative isolate min-h-[78vh] overflow-hidden">
        <HeroMedia />
        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-forest-950/85 via-forest-950/55 to-transparent" />
        <div className="container-x relative flex min-h-[78vh] flex-col justify-center py-16 text-white">
          <p className="eyebrow !text-lime-300">Chesterfield &amp; Midlothian, VA</p>
          <h1 className="h-display mt-3 max-w-3xl text-6xl !text-white md:text-8xl">
            Your yard, <span className="accent text-lime-300">handled.</span> Every season.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90">
            <span className="hl-sun font-semibold">Local</span> and <span className="hl-sun font-semibold">hard-working</span> to meet all your yard care needs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LimeButton href="/quote">Get my free quote</LimeButton>
            <ElectricButton href={SMS} icon={<MessageSquareText aria-hidden />}>Text a photo</ElectricButton>
          </div>
        </div>
      </section>
      <section className="container-x py-16">
        <ServiceBadges />
        <p className="mt-12 text-center text-[var(--muted)]">
          Phase 1 preview — see the <Link className="text-[var(--link)] underline" href="/styleguide">style tile</Link>.
        </p>
      </section>
    </>
  );
}
