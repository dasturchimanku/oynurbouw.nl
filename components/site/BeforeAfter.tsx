"use client";

import Image from "next/image";
import { useState } from "react";

type Img = { src: string; width: number; height: number; alt: string };

export function BeforeAfter({ before, after, labels }: { before: Img; after: Img; labels: { before: string; after: string } }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] bg-sand select-none">
      <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
      </div>
      <span className="absolute top-4 left-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white uppercase">{labels.before}</span>
      <span className="absolute top-4 right-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white uppercase">{labels.after}</span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-lift">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`${labels.before} / ${labels.after}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
