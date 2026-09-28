"use client";

import { Media } from "@/components/Media";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  CircleAlert,
  ExternalLink,
  GripVertical,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  X,
} from "lucide-react";
import type { ImageKind, Locale, Localized, ProjectImage } from "@/lib/types";
import { slugify } from "@/lib/site";
import { saveProject, deleteProject } from "@/app/admin/actions";
import { ACCEPT_MEDIA, uploadImage } from "./upload";

import type { Draft } from "@/lib/projects";

const emptyL = (): Localized => ({ nl: "", en: "" });

type Upload = { key: string; name: string; progress: number; error?: string };

export function ProjectForm({
  initial,
  services,
  siteUrl,
}: {
  initial: Draft;
  services: { key: string; label: string }[];
  siteUrl: string;
}) {
  const router = useRouter();
  const [d, setD] = useState<Draft>(initial);
  const [lang, setLang] = useState<Locale>("nl");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [saving, startSave] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function update(patch: Partial<Draft>) {
    setD((prev) => ({ ...prev, ...patch }));
    setDirty(true);
    setMessage(null);
  }
  function setL(field: "title" | "summary" | "description" | "duration" | "seoTitle" | "seoDescription", value: string) {
    setD((prev) => {
      const next = { ...prev, [field]: { ...prev[field], [lang]: value } };
      if (field === "title" && !slugTouched && lang === "nl") next.slug = slugify(value);
      if (field === "title" && !slugTouched && lang === "en" && !prev.title.nl) next.slug = slugify(value);
      return next;
    });
    setDirty(true);
    setMessage(null);
  }
  function setImage(id: string, patch: Partial<ProjectImage>) {
    update({ images: d.images.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
  }
  function moveImage(id: string, dir: number) {
    const arr = [...d.images];
    const i = arr.findIndex((x) => x.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    update({ images: arr });
  }
  function dropOn(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const arr = [...d.images];
    const from = arr.findIndex((x) => x.id === dragId);
    const to = arr.findIndex((x) => x.id === targetId);
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    update({ images: arr });
    setDragId(null);
  }

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/") || /\.(heic|heif|mov|mp4|webm|gif)$/i.test(f.name));
    for (const file of list) {
      const key = `${file.name}-${Math.random()}`;
      setUploads((u) => [...u, { key, name: file.name, progress: 0 }]);
      try {
        const img = await uploadImage(file, (p) => setUploads((u) => u.map((x) => (x.key === key ? { ...x, progress: p } : x))));
        const image: ProjectImage = { id: img.id, src: img.src, width: img.width, height: img.height, alt: emptyL(), kind: "gallery", media: img.media };
        setD((prev) => ({ ...prev, images: [...prev.images, image], coverImageId: prev.coverImageId ?? image.id }));
        setDirty(true);
        setUploads((u) => u.filter((x) => x.key !== key));
      } catch (e) {
        setUploads((u) => u.map((x) => (x.key === key ? { ...x, error: (e as Error).message } : x)));
      }
    }
  }

  function save(publish?: boolean) {
    const payload = publish === undefined ? d : { ...d, published: publish };
    startSave(async () => {
      let res: Awaited<ReturnType<typeof saveProject>>;
      try {
        res = await saveProject(payload);
      } catch (e) {
        setMessage({ type: "error", text: `Could not save (${(e as Error).message || "server error"}). Are you still logged in? Refresh and try again.` });
        return;
      }
      if (res.ok) {
        setDirty(false);
        setD(payload);
        setMessage({ type: "ok", text: "Saved! The website has been updated." });
        if (!d.id) router.replace(`/admin/projects/${res.id}?saved=1`);
        else router.refresh();
      } else {
        setMessage({ type: "error", text: res.error });
      }
    });
  }

  const title = d.title[lang];
  const busy = uploads.some((u) => !u.error);
  const seoTitle = d.seoTitle[lang] || d.title[lang] || d.title.nl;
  const seoDesc = d.seoDescription[lang] || d.summary[lang] || d.summary.nl || d.description[lang].slice(0, 155);
  const langTab = (l: Locale, label: string) => (
    <button
      type="button"
      onClick={() => setLang(l)}
      className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${lang === l ? "bg-white text-ink shadow-sm" : "text-stone hover:text-ink"}`}
    >
      {label}
      {l === "en" && !d.title.en && <span className="ml-1.5 text-xs font-normal text-stone">(optional)</span>}
    </button>
  );

  return (
    <div className="pb-28">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-stone hover:text-ink">
          <ChevronLeft className="size-4" /> Portfolio
        </Link>
        {d.id && d.published && (
          <a href={`/nl/projecten/${d.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">
            View on website <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>
      <h1 className="mb-8 text-2xl font-extrabold sm:text-3xl">{d.id ? d.title.nl || d.title.en || "Edit project" : "New project"}</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* ── Texts ── */}
          <section className="card p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Project texts</h2>
              <div className="flex rounded-xl bg-sand p-1">
                {langTab("nl", "🇳🇱 Dutch")}
                {langTab("en", "🇬🇧 English")}
              </div>
            </div>
            {lang === "en" && (
              <p className="mb-4 rounded-xl bg-brand-50 p-3 text-sm text-brand-700">
                English is optional. Empty English fields automatically show the Dutch text on the English website.
              </p>
            )}
            <div className="space-y-4">
              <div>
                <label className="label" htmlFor="title">
                  Title {lang === "nl" && <span className="text-brand">*</span>}
                </label>
                <input
                  id="title"
                  className="field !text-base"
                  value={title}
                  onChange={(e) => setL("title", e.target.value)}
                  placeholder={lang === "nl" ? "Bijv. Complete badkamerrenovatie in Rotterdam" : "E.g. Complete bathroom renovation in Rotterdam"}
                />
              </div>
              <div>
                <label className="label" htmlFor="summary">
                  Short summary <span className="font-normal text-stone">— shown under the title and in Google</span>
                </label>
                <textarea
                  id="summary"
                  rows={2}
                  maxLength={300}
                  className="field"
                  value={d.summary[lang]}
                  onChange={(e) => setL("summary", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="description">
                  Full description <span className="font-normal text-stone">— leave an empty line between paragraphs</span>
                </label>
                <textarea
                  id="description"
                  rows={8}
                  className="field"
                  value={d.description[lang]}
                  onChange={(e) => setL("description", e.target.value)}
                  placeholder={
                    lang === "nl"
                      ? "Wat was de wens van de klant? Wat hebben jullie gedaan? Welke materialen zijn gebruikt?"
                      : "What did the client want? What did you do? Which materials were used?"
                  }
                />
              </div>
              <div>
                <label className="label" htmlFor="duration">
                  Duration
                </label>
                <input
                  id="duration"
                  className="field"
                  value={d.duration[lang]}
                  onChange={(e) => setL("duration", e.target.value)}
                  placeholder={lang === "nl" ? "Bijv. 3 weken" : "E.g. 3 weeks"}
                />
              </div>
            </div>
          </section>

          {/* ── Photos ── */}
          <section className="card p-6">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-bold">Photos</h2>
              <span className="text-sm text-stone">{d.images.length} photo(s)</span>
            </div>
            <p className="mb-5 text-sm text-stone">
              Drag to reorder. <Star className="inline size-3.5" /> = cover photo. Mark photos as <b>Before</b> and <b>After</b> to show an
              interactive before/after slider (1st before ↔ 1st after, and so on).
            </p>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInput.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-sand/30 px-6 py-10 text-center transition hover:border-brand hover:bg-brand-50/50"
            >
              <ImagePlus className="size-8 text-brand" />
              <p className="mt-3 font-semibold">Drop photos, GIFs or videos here — or click to upload</p>
              <p className="mt-1 text-sm text-stone">JPG, PNG, HEIC, GIF (stays animated) or MP4/MOV video (plays like a GIF) · multiple at once</p>
              <input
                ref={fileInput}
                type="file"
                accept={ACCEPT_MEDIA}
                multiple
                hidden
                onChange={(e) => {
                  if (e.target.files) handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>

            {uploads.length > 0 && (
              <ul className="mt-4 space-y-2">
                {uploads.map((u) => (
                  <li key={u.key} className="flex items-center gap-3 rounded-xl bg-sand/50 px-3 py-2 text-sm">
                    {u.error ? <CircleAlert className="size-4 text-red-600" /> : <Loader2 className="size-4 animate-spin text-brand" />}
                    <span className="min-w-0 flex-1 truncate">{u.name}</span>
                    {u.error ? (
                      <>
                        <span className="text-red-600">{u.error}</span>
                        <button type="button" onClick={() => setUploads((x) => x.filter((y) => y.key !== u.key))} aria-label="Dismiss">
                          <X className="size-4" />
                        </button>
                      </>
                    ) : (
                      <span className="w-24">
                        <span className="block h-1.5 overflow-hidden rounded-full bg-line">
                          <span className="block h-full bg-brand transition-all" style={{ width: `${u.progress}%` }} />
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {d.images.length > 0 && (
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {d.images.map((img, idx) => {
                  const isCover = d.coverImageId === img.id;
                  return (
                    <li
                      key={img.id}
                      draggable
                      onDragStart={() => setDragId(img.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dropOn(img.id);
                      }}
                      className={`overflow-hidden rounded-xl border bg-white transition ${dragId === img.id ? "opacity-40" : ""} ${
                        isCover ? "border-brand ring-2 ring-brand/30" : "border-line"
                      }`}
                    >
                      <div className="group relative aspect-[4/3] bg-sand">
                        <Media item={img} alt="" fill sizes="300px" className="object-cover" />
                        <span className="absolute top-2 left-2 grid size-7 cursor-grab place-items-center rounded-md bg-white/90 text-stone">
                          <GripVertical className="size-4" />
                        </span>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => update({ coverImageId: img.id })}
                            className={`grid size-8 place-items-center rounded-md ${isCover ? "bg-brand text-white" : "bg-white/90 text-stone hover:text-brand"}`}
                            title={isCover ? "Cover photo" : "Set as cover photo"}
                            aria-label="Set as cover"
                          >
                            <Star className={`size-4 ${isCover ? "fill-current" : ""}`} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              update({
                                images: d.images.filter((i) => i.id !== img.id),
                                coverImageId: isCover ? (d.images.find((i) => i.id !== img.id)?.id ?? null) : d.coverImageId,
                              })
                            }
                            className="grid size-8 place-items-center rounded-md bg-white/90 text-stone hover:text-red-600"
                            title="Remove photo"
                            aria-label="Remove photo"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        {isCover && (
                          <span className="absolute bottom-2 left-2 rounded-md bg-brand px-2 py-0.5 text-xs font-semibold text-white">Cover</span>
                        )}
                      </div>
                      <div className="space-y-2 p-3">
                        <div className="flex gap-1.5">
                          {(["gallery", "before", "after"] as ImageKind[]).map((k) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setImage(img.id, { kind: k })}
                              className={`flex-1 rounded-lg px-2 py-1 text-xs font-semibold capitalize transition ${
                                img.kind === k ? (k === "after" ? "bg-brand text-white" : "bg-ink text-white") : "bg-sand text-stone hover:text-ink"
                              }`}
                            >
                              {k === "gallery" ? "Photo" : k}
                            </button>
                          ))}
                        </div>
                        <input
                          className="field !py-1.5 !text-xs"
                          placeholder={lang === "nl" ? "Beschrijving (alt-tekst, SEO)" : "Description (alt text, SEO)"}
                          value={img.alt[lang]}
                          onChange={(e) => setImage(img.id, { alt: { ...img.alt, [lang]: e.target.value } })}
                        />
                        <div className="flex justify-between">
                          <button type="button" onClick={() => moveImage(img.id, -1)} disabled={idx === 0} className="rounded p-1 text-stone hover:text-ink disabled:opacity-30" aria-label="Move left">
                            <ArrowLeft className="size-4" />
                          </button>
                          <span className="text-xs text-stone">
                            {idx + 1} / {d.images.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => moveImage(img.id, 1)}
                            disabled={idx === d.images.length - 1}
                            className="rounded p-1 text-stone hover:text-ink disabled:opacity-30"
                            aria-label="Move right"
                          >
                            <ArrowRight className="size-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* ── SEO ── */}
          <section className="card p-6">
            <h2 className="text-lg font-bold">Search engine (SEO)</h2>
            <p className="mb-5 text-sm text-stone">Optional. When empty, the title and summary are used. Editing: {lang === "nl" ? "Dutch" : "English"}.</p>
            <div className="mb-5 rounded-xl border border-line p-4">
              <p className="text-xs text-stone">Google preview</p>
              <p className="mt-2 truncate text-sm text-[#202124]">
                {siteUrl.replace(/^https?:\/\//, "")} › {lang === "nl" ? "projecten" : "projects"} › {d.slug || "…"}
              </p>
              <p className="truncate text-lg text-[#1a0dab]">{(seoTitle || "Project title") + " | Oynur Bouw"}</p>
              <p className="line-clamp-2 text-sm text-[#4d5156]">{seoDesc || "Short description of the project…"}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label" htmlFor="seoTitle">
                  SEO title <span className="font-normal text-stone">({d.seoTitle[lang].length}/60)</span>
                </label>
                <input id="seoTitle" className="field" maxLength={70} value={d.seoTitle[lang]} onChange={(e) => setL("seoTitle", e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="seoDescription">
                  Meta description <span className="font-normal text-stone">({d.seoDescription[lang].length}/155)</span>
                </label>
                <textarea
                  id="seoDescription"
                  rows={2}
                  maxLength={180}
                  className="field"
                  value={d.seoDescription[lang]}
                  onChange={(e) => setL("seoDescription", e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        {/* ── Sidebar ── */}
        <aside className="space-y-6">
          <section className="card space-y-4 p-6">
            <h2 className="text-lg font-bold">Visibility</h2>
            <Toggle checked={d.published} onChange={(v) => update({ published: v })} label="Published" hint="Visible on the website" />
            <Toggle checked={d.featured} onChange={(v) => update({ featured: v })} label="Featured" hint="Shown first on the homepage" />
          </section>
          <section className="card space-y-4 p-6">
            <h2 className="text-lg font-bold">Details</h2>
            <div>
              <label className="label" htmlFor="category">
                Category (service)
              </label>
              <select id="category" className="field" value={d.category} onChange={(e) => update({ category: e.target.value })}>
                <option value="">— Choose —</option>
                {services.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="location">
                Location (city)
              </label>
              <input id="location" className="field" value={d.location} onChange={(e) => update({ location: e.target.value })} placeholder="E.g. Rotterdam" />
            </div>
            <div>
              <label className="label" htmlFor="year">
                Year
              </label>
              <input id="year" className="field" inputMode="numeric" value={d.year} onChange={(e) => update({ year: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="slug">
                URL
              </label>
              <div className="flex items-center rounded-xl border border-line bg-sand/40 pl-3 text-sm text-stone focus-within:border-brand">
                <span className="shrink-0">/projecten/</span>
                <input
                  id="slug"
                  className="min-w-0 flex-1 bg-transparent py-2.5 pr-3 text-ink outline-none"
                  value={d.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    update({ slug: slugify(e.target.value) });
                  }}
                />
              </div>
            </div>
          </section>
          {d.id && (
            <section className="card p-6">
              <h2 className="text-lg font-bold text-red-700">Danger zone</h2>
              {confirmDelete ? (
                <div className="mt-3 space-y-3">
                  <p className="text-sm">Delete this project and all its photos permanently?</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => startDelete(() => deleteProject(d.id!))}
                      className="btn flex-1 bg-red-600 !py-2 text-white hover:bg-red-700"
                    >
                      {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Delete
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(false)} className="btn-ghost flex-1 !py-2">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="btn mt-3 w-full border border-red-200 !py-2 text-red-600 hover:bg-red-50">
                  <Trash2 className="size-4" /> Delete project
                </button>
              )}
            </section>
          )}
        </aside>
      </div>

      {/* ── Sticky save bar ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-10">
          {message && (
            <p className={`mr-auto flex items-center gap-2 text-sm ${message.type === "ok" ? "text-green-700" : "text-red-600"}`} role="status">
              {message.type === "ok" ? <Check className="size-4" /> : <CircleAlert className="size-4" />} {message.text}
            </p>
          )}
          {!message && dirty && <p className="mr-auto text-sm text-stone">Unsaved changes</p>}
          {!d.published && (
            <button type="button" disabled={saving || busy} onClick={() => save(true)} className="btn-ghost">
              Save & publish
            </button>
          )}
          <button type="button" disabled={saving || busy || (!d.title.nl && !d.title.en)} onClick={() => save()} className="btn-primary min-w-32">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            {busy ? "Uploading…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-stone">{hint}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-brand" : "bg-line"}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}
