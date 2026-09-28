"use client";

import { useTransition } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Star } from "lucide-react";
import { moveProject, toggleProject } from "@/app/admin/actions";

export function ProjectRowActions({ id, published, featured, first, last }: { id: string; published: boolean; featured: boolean; first: boolean; last: boolean }) {
  const [pending, start] = useTransition();
  const btn = "grid size-9 place-items-center rounded-lg border border-line bg-white text-stone transition hover:border-ink/30 hover:text-ink disabled:opacity-40";
  return (
    <div className="flex items-center gap-1.5">
      {pending && <Loader2 className="size-4 animate-spin text-stone" />}
      <button
        type="button"
        className={`${btn} ${published ? "!text-green-700" : ""}`}
        title={published ? "Published – click to hide" : "Draft – click to publish"}
        aria-label={published ? "Unpublish" : "Publish"}
        onClick={() => start(() => toggleProject(id, "published"))}
        disabled={pending}
      >
        {published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      </button>
      <button
        type="button"
        className={`${btn} ${featured ? "!border-brand/40 !text-brand" : ""}`}
        title={featured ? "Featured on homepage – click to remove" : "Feature on homepage"}
        aria-label="Toggle featured"
        onClick={() => start(() => toggleProject(id, "featured"))}
        disabled={pending}
      >
        <Star className={`size-4 ${featured ? "fill-current" : ""}`} />
      </button>
      <button type="button" className={btn} title="Move up" aria-label="Move up" disabled={pending || first} onClick={() => start(() => moveProject(id, -1))}>
        <ArrowUp className="size-4" />
      </button>
      <button type="button" className={btn} title="Move down" aria-label="Move down" disabled={pending || last} onClick={() => start(() => moveProject(id, 1))}>
        <ArrowDown className="size-4" />
      </button>
    </div>
  );
}
