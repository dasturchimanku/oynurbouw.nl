"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Img = { src: string; width: number; height: number; alt: string };

export function Gallery({ images, labels }: { images: Img[]; labels: { close: string; photoOf: string } }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const move = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, move]);

  const label = (i: number) => labels.photoOf.replace("{i}", String(i + 1)).replace("{n}", String(images.length));

  return (
    <>
      <ul className="columns-2 gap-3 lg:columns-3 lg:gap-4 [&>li]:mb-3 lg:[&>li]:mb-4">
        {images.map((img, i) => (
          <li key={img.src} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden rounded-2xl bg-sand"
              aria-label={img.alt || label(i)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="h-auto w-full transition duration-500 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      {index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label(index)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur"
          onClick={close}
        >
          <div className="relative h-[85vh] w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[index].src}
              alt={images[index].alt}
              fill
              sizes="92vw"
              className="object-contain"
              quality={85}
            />
          </div>
          <p className="absolute top-5 left-5 text-sm text-white/70">{label(index)}</p>
          <button type="button" onClick={close} aria-label={labels.close} className="absolute top-4 right-4 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
            <X className="size-6" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  move(-1);
                }}
                aria-label="←"
                className="absolute left-3 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  move(1);
                }}
                aria-label="→"
                className="absolute right-3 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
