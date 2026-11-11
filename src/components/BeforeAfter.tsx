"use client";
import Image from "next/image";
import { useId, useState } from "react";

/** Before/after slider for the owner's REAL job photos only. */
export function BeforeAfter({ before, after, alt, width, height, unoptimized = false }: { before: string; after: string; alt: string; width: number; height: number; unoptimized?: boolean }) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure className="cyc-ba relative select-none" style={{ aspectRatio: `${width}/${height}` }}>
      <Image src={after} alt={`After: ${alt}`} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" unoptimized={unoptimized} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={`Before: ${alt}`} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" unoptimized={unoptimized} />
      </div>
      <div className="handle pointer-events-none" style={{ left: `calc(${pos}% - 2px)` }} />
      <span className="pill absolute left-3 top-3">Before</span>
      <span className="pill absolute right-3 top-3">After</span>
      <label htmlFor={id} className="sr-only">Drag to compare before and after</label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}
