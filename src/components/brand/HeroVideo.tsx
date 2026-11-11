"use client";
import { useEffect, useRef, useState } from "react";

type Source = { src: string; type: string; media?: string };

/**
 * Loads the background loop only after the page has finished loading and the browser is idle,
 * so the poster image stays the LCP element. Skipped for reduced motion and Save-Data.
 */
export function HeroVideo({ poster, sources }: { poster: string; sources: Source[] }) {
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduce || conn?.saveData) return;
    const start = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
      if (idle) idle(() => setEnabled(true));
      else setTimeout(() => setEnabled(true), 1200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  useEffect(() => {
    if (enabled) ref.current?.play().catch(() => {});
  }, [enabled]);

  if (!enabled) return null;
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
      style={{ opacity: playing ? 1 : 0 }}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} media={s.media} />
      ))}
    </video>
  );
}
