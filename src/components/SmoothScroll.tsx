"use client";
import { useEffect } from "react";

/** Lenis smooth scroll — loaded lazily, never for reduced motion or touch-first devices. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // native scrolling is better on phones
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp: 0.12 });
      const loop = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); };
  }, []);
  return null;
}
