import { MobileActionBar } from "@/components/brand/CycUI";
import { JsonLd } from "@/components/sections";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Tracking } from "@/components/Tracking";
import { localBusinessSchema } from "@/lib/schema";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-lime-500 focus:px-4 focus:py-2 focus:text-forest-950">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <MobileActionBar />
      <SmoothScroll />
      <Tracking />
      <JsonLd data={localBusinessSchema()} />
    </>
  );
}
