"use client";

import { Media } from "@/components/Media";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import type { ProjectImage } from "@/lib/types";
import { ACCEPT_MEDIA, uploadImage } from "./upload";

export function SingleImageField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: ProjectImage | null;
  onChange: (v: ProjectImage | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function pick(file?: File) {
    if (!file) return;
    setError("");
    setProgress(0);
    try {
      const img = await uploadImage(file, setProgress);
      onChange({ id: img.id, src: img.src, width: img.width, height: img.height, alt: value?.alt || { nl: "", en: "" }, kind: "gallery", media: img.media });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProgress(null);
    }
  }

  return (
    <div>
      <p className="label">{label}</p>
      {hint && <p className="-mt-1 mb-2 text-xs text-stone">{hint}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="relative grid aspect-[4/3] w-full max-w-xs place-items-center overflow-hidden rounded-xl border-2 border-dashed border-line bg-sand/40 text-stone transition hover:border-brand hover:text-brand"
        >
          {value ? (
            <Media item={value} alt="" fill sizes="320px" className="object-cover" />
          ) : progress === null ? (
            <span className="flex flex-col items-center gap-2 text-sm">
              <ImagePlus className="size-7" /> Upload photo / GIF / video
            </span>
          ) : null}
          {progress !== null && (
            <span className="absolute inset-0 grid place-items-center bg-white/80 text-sm font-semibold text-ink">
              <Loader2 className="size-6 animate-spin" /> {progress}%
            </span>
          )}
        </button>
        {value && (
          <div className="flex-1 space-y-2">
            <input
              className="field"
              placeholder="Alt text (NL) – describe the photo"
              value={value.alt.nl}
              onChange={(e) => onChange({ ...value, alt: { ...value.alt, nl: e.target.value } })}
            />
            <input
              className="field"
              placeholder="Alt text (EN)"
              value={value.alt.en}
              onChange={(e) => onChange({ ...value, alt: { ...value.alt, en: e.target.value } })}
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => input.current?.click()} className="btn-ghost !px-4 !py-2 text-sm">
                Replace
              </button>
              <button type="button" onClick={() => onChange(null)} className="btn !px-4 !py-2 text-sm text-red-600 hover:bg-red-50">
                <Trash2 className="size-4" /> Remove
              </button>
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <input ref={input} type="file" accept={ACCEPT_MEDIA} hidden onChange={(e) => pick(e.target.files?.[0])} />
    </div>
  );
}
