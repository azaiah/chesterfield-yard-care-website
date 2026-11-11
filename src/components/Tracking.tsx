"use client";
import Script from "next/script";
import { useEffect } from "react";

// UTM capture (first touch per browser, 30 days) + call/text/quote click events + GA4 / Meta Pixel.
// Analytics IDs are optional: NEXT_PUBLIC_GA4_ID, NEXT_PUBLIC_META_PIXEL_ID.

type Utm = Record<string, string>;
const KEY = "cyc-utm";
const GA = process.env.NEXT_PUBLIC_GA4_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  try {
    window.gtag?.("event", event, params);
    window.fbq?.("trackCustom", event, params);
    if (event === "generate_lead") window.fbq?.("track", "Lead", params);
  } catch {}
}

export function getUtm(): Utm | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const { v, t } = JSON.parse(raw) as { v: Utm; t: number };
    return Date.now() - t < 30 * 864e5 ? v : undefined;
  } catch {
    return undefined;
  }
}

function captureUtm() {
  try {
    const q = new URLSearchParams(location.search);
    const v: Utm = {};
    for (const k of ["source", "medium", "campaign", "term", "content"]) {
      const val = q.get(`utm_${k}`);
      if (val) v[k] = val.slice(0, 150);
    }
    for (const k of ["gclid", "fbclid"]) { const val = q.get(k); if (val) v[k] = val.slice(0, 200); }
    const external = document.referrer && !document.referrer.startsWith(location.origin);
    if (Object.keys(v).length || (external && !getUtm())) {
      if (external) v.referrer = document.referrer.slice(0, 500);
      v.landing = location.pathname;
      localStorage.setItem(KEY, JSON.stringify({ v, t: Date.now() }));
    } else if (!getUtm()) {
      localStorage.setItem(KEY, JSON.stringify({ v: { source: "direct", landing: location.pathname }, t: Date.now() }));
    }
  } catch {}
}

export function Tracking() {
  useEffect(() => {
    captureUtm();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      const href = a?.getAttribute("href") ?? "";
      const where = { page: location.pathname, label: a?.textContent?.trim().slice(0, 40) };
      if (href.startsWith("tel:")) track("click_call", where);
      else if (href.startsWith("sms:")) track("click_text", where);
      else if (href === "/quote" || href.startsWith("/quote?")) track("click_quote", where);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <>
      {GA && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="lazyOnload" />
          <Script id="ga4" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA}');`}
          </Script>
        </>
      )}
      {PIXEL && (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
