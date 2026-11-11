"use client";
import type { ReactNode } from "react";

/** Sets --mx/--my on whichever .cyc-feature / .bento-tile the pointer is over. One listener for the whole grid. */
export function SpotlightArea({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
      onPointerMove={(e) => {
        const card = (e.target as Element).closest<HTMLElement>(".cyc-feature, .bento-tile");
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
