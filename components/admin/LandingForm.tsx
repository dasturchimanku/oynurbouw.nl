"use client";

import { Media } from "@/components/Media";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Check, ChevronLeft, CircleAlert, ExternalLink, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import type { Landing, Locale, Localized, PriceItem, ProjectImage } from "@/lib/types";
import { saveLanding } from "@/app/admin/actions";
import { SingleImageField } from "./SingleImageField";
import { ACCEPT_MEDIA, uploadImage } from "./upload";

type Draft = Omit<Landing, "updatedAt">;
const E = (): Localized => ({ nl: "", en: "" });

function move<T>(arr: T[], i: number, d: number) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const a = [...arr];
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}

function Card({ title, hint, children, id }: { title: string; hint?: string; children: React.ReactNode; id?: string }) {
return (
  <section id={id} className="card scroll-mt-24 space-y-4 p-6">
    <div>
      <h2 className="text-lg font-bold">{title}</h2>
      {hint && <p className="text-sm text-stone">{hint}</p>}
    </div>
    {children}
  </section>
);
}

export function LandingForm({
  initial,
  label,
  viewUrl,
  portfolioInfo,
}: {
  initial: Draft;
  label: string;
  viewUrl: string;
  portfolioInfo: { category: string; count: number };
}) {
  const [d, setD] = useState<Draft>(initial);
  const [lang, setLang] = useState<Locale>("nl");
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, start] = useTransition();
  const [uploading, setUploading] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => dirty && e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  function set(patch: Partial<Draft>) {
    setD((p) => ({ ...p, ...patch }));
    setDirty(true);
    setMsg(null);
  }
  const lv = (v: Localized) => v[lang];
  const lset = (v: Localized, text: string): Localized => ({ ...v, [lang]: text });

  async function addTeamPhotos(files: FileList) {
    for (const file of Array.from(files)) {
      setUploading((n) => n + 1);
      try {
        const r = await uploadImage(file);
        const img: ProjectImage = { id: r.id, src: r.src, width: r.width, height: r.height, alt: E(), kind: "gallery", media: r.media };
        setD((p) => ({ ...p, teamImages: [...p.teamImages, img] }));
        setDirty(true);
      } catch (e) {
        setMsg({ ok: false, text: (e as Error).message });
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  function save() {
    start(async () => {
      try {
        const res = await saveLanding(d);
        if (res.ok) {
          setDirty(false);
          setMsg({ ok: true, text: "Saved! The page has been updated." });
        } else setMsg({ ok: false, text: res.error || "Error" });
      } catch (e) {
        setMsg({ ok: false, text: `Could not save (${(e as Error).message || "server error"}). Are you still logged in? Refresh the page and try again.` });
      }
    });
  }

  const T = ({ label: l, value, onChange, rows = 1, placeholder }: { label: string; value: Localized; onChange: (v: Localized) => void; rows?: number; placeholder?: string }) => (
    <div>
      <label className="label">
        {l} <span className="font-normal text-stone">({lang.toUpperCase()})</span>
      </label>
      {rows > 1 ? (
        <textarea rows={rows} className="field" value={lv(value)} placeholder={placeholder} onChange={(e) => onChange(lset(value, e.target.value))} />
      ) : (
        <input className="field" value={lv(value)} placeholder={placeholder} onChange={(e) => onChange(lset(value, e.target.value))} />
      )}
    </div>
  );

  const rowBtns = (onUp: () => void, onDown: () => void, onDel: () => void) => (
    <div className="flex shrink-0 gap-1">
      <button type="button" onClick={onUp} className="grid size-8 place-items-center rounded-lg border border-line text-stone hover:text-ink" aria-label="Up">
        <ArrowUp className="size-4" />
      </button>
      <button type="button" onClick={onDown} className="grid size-8 place-items-center rounded-lg border border-line text-stone hover:text-ink" aria-label="Down">
        <ArrowDown className="size-4" />
      </button>
      <button type="button" onClick={onDel} className="grid size-8 place-items-center rounded-lg border border-line text-stone hover:text-red-600" aria-label="Delete">
        <Trash2 className="size-4" />
      </button>
    </div>
  );

  return (
    <div className="pb-28">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/landings" className="inline-flex items-center gap-1.5 text-sm font-medium text-stone hover:text-ink">
          <ChevronLeft className="size-4" /> Landing pages
        </Link>
        <a href={viewUrl} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">
          View page <ExternalLink className="size-3.5" />
        </a>
      </div>

      <div className="sticky top-[116px] z-20 -mx-4 mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#f5f2ee]/95 px-4 py-3 backdrop-blur lg:top-0">
        <h1 className="text-2xl font-extrabold sm:text-3xl">{label}</h1>
        <div className="flex rounded-xl bg-white p-1 shadow-xs">
          {(["nl", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold ${lang === l ? "bg-ink text-white" : "text-stone hover:text-ink"}`}
            >
              {l === "nl" ? "🇳🇱 Dutch" : "🇬🇧 English"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Card title="Visibility">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-semibold">Published</span>
              <span className="block text-xs text-stone">Hidden pages show a 404 and disappear from the menu cards.</span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={d.published}
              onClick={() => set({ published: !d.published })}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${d.published ? "bg-brand" : "bg-line"}`}
            >
              <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${d.published ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </label>
        </Card>

        <Card title="Top of the page (hero)" hint="Use {in} to insert “in <your city>” automatically, e.g. “Stukadoor{in}”.">
          {T({ label: "Small label above title", value: d.eyebrow, onChange: (v) => set({ eyebrow: v }) })}
          <div className="grid gap-4 sm:grid-cols-2">
            {T({ label: "Title (black)", value: d.title, onChange: (v) => set({ title: v }) })}
            {T({ label: "Title (orange)", value: d.titleAccent, onChange: (v) => set({ titleAccent: v }) })}
          </div>
          {T({ label: "Intro text", value: d.text, onChange: (v) => set({ text: v }), rows: 3 })}
          <SingleImageField label="Main photo" hint="Square photos work best." value={d.heroImage} onChange={(v) => set({ heroImage: v })} />
          <div>
            <p className="label">Check marks under the buttons</p>
            <div className="space-y-2">
              {d.usps.map((u, i) => (
                <div key={i} className="flex gap-2">
                  <input className="field" value={lv(u)} onChange={(e) => set({ usps: d.usps.map((x, j) => (j === i ? lset(x, e.target.value) : x)) })} />
                  {rowBtns(
                    () => set({ usps: move(d.usps, i, -1) }),
                    () => set({ usps: move(d.usps, i, 1) }),
                    () => set({ usps: d.usps.filter((_, j) => j !== i) }),
                  )}
                </div>
              ))}
              {d.usps.length < 6 && (
                <button type="button" onClick={() => set({ usps: [...d.usps, E()] })} className="btn-ghost !px-4 !py-2 text-sm">
                  <Plus className="size-4" /> Add
                </button>
              )}
            </div>
          </div>
        </Card>

        <Card title="Services" hint="The list of what you do on this page.">
          {T({ label: "Section title", value: d.servicesTitle, onChange: (v) => set({ servicesTitle: v }) })}
          <div className="space-y-3">
            {d.services.map((s, i) => (
              <div key={i} className="rounded-xl border border-line p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <input className="field font-semibold" placeholder="Title" value={lv(s.title)} onChange={(e) => set({ services: d.services.map((x, j) => (j === i ? { ...x, title: lset(x.title, e.target.value) } : x)) })} />
                    <textarea rows={2} className="field" placeholder="Description" value={lv(s.text)} onChange={(e) => set({ services: d.services.map((x, j) => (j === i ? { ...x, text: lset(x.text, e.target.value) } : x)) })} />
                  </div>
                  {rowBtns(
                    () => set({ services: move(d.services, i, -1) }),
                    () => set({ services: move(d.services, i, 1) }),
                    () => set({ services: d.services.filter((_, j) => j !== i) }),
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={() => set({ services: [...d.services, { title: E(), text: E() }] })} className="btn-ghost !px-4 !py-2 text-sm">
              <Plus className="size-4" /> Add service
            </button>
          </div>
        </Card>

        <Card id="prices" title="Prices" hint="Price 0 = “on request”. ‘Calculator’ = included in the price calculator (price × amount).">
          <div className="space-y-3">
            {d.prices.map((p, i) => {
              const up = (patch: Partial<PriceItem>) => set({ prices: d.prices.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
              return (
                <div key={p.id} className="rounded-xl border border-line p-3">
                  <div className="flex items-start gap-2">
                    <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_110px_130px]">
                      <input className="field font-semibold" placeholder="Name" value={lv(p.name)} onChange={(e) => up({ name: lset(p.name, e.target.value) })} />
                      <div className="flex items-center rounded-xl border border-line bg-white pl-3 focus-within:border-brand">
                        <span className="text-sm text-stone">€</span>
                        <input
                          type="number"
                          min={0}
                          step="0.5"
                          className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
                          value={p.price}
                          onChange={(e) => up({ price: Math.max(0, Number(e.target.value) || 0) })}
                        />
                      </div>
                      <input className="field" placeholder="per m²" value={lv(p.unit)} onChange={(e) => up({ unit: lset(p.unit, e.target.value) })} />
                      <input className="field sm:col-span-2" placeholder="Note (optional)" value={lv(p.note)} onChange={(e) => up({ note: lset(p.note, e.target.value) })} />
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="size-4 accent-brand" checked={p.calc} onChange={(e) => up({ calc: e.target.checked })} /> Calculator
                      </label>
                    </div>
                    {rowBtns(
                      () => set({ prices: move(d.prices, i, -1) }),
                      () => set({ prices: move(d.prices, i, 1) }),
                      () => set({ prices: d.prices.filter((_, j) => j !== i) }),
                    )}
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() =>
                set({
                  prices: [...d.prices, { id: Math.random().toString(36).slice(2, 10), name: E(), price: 0, unit: { nl: "per m²", en: "per m²" }, calc: true, note: E() }],
                })
              }
              className="btn-ghost !px-4 !py-2 text-sm"
            >
              <Plus className="size-4" /> Add price
            </button>
          </div>
          {T({ label: "Note under the prices", value: d.priceNote, onChange: (v) => set({ priceNote: v }), rows: 2 })}
        </Card>

        <Card title="Team at work" hint="Photos of your people working. Shown as a large photo section.">
          <div className="grid gap-4 sm:grid-cols-2">
            {T({ label: "Section title", value: d.teamTitle, onChange: (v) => set({ teamTitle: v }) })}
            {T({ label: "Short text", value: d.teamText, onChange: (v) => set({ teamText: v }) })}
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {d.teamImages.map((im, i) => (
              <li key={im.id + i} className="overflow-hidden rounded-xl border border-line bg-white">
                <div className="relative aspect-square bg-sand">
                  <Media item={im} alt="" fill sizes="250px" className="object-cover" />
                </div>
                <div className="space-y-2 p-2">
                  <input
                    className="field !py-1.5 !text-xs"
                    placeholder="Photo description (SEO)"
                    value={lv(im.alt)}
                    onChange={(e) => set({ teamImages: d.teamImages.map((x, j) => (j === i ? { ...x, alt: lset(x.alt, e.target.value) } : x)) })}
                  />
                  <div className="flex justify-end">
                    {rowBtns(
                      () => set({ teamImages: move(d.teamImages, i, -1) }),
                      () => set({ teamImages: move(d.teamImages, i, 1) }),
                      () => set({ teamImages: d.teamImages.filter((_, j) => j !== i) }),
                    )}
                  </div>
                </div>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line text-sm text-stone hover:border-brand hover:text-brand"
              >
                {uploading > 0 ? <Loader2 className="size-6 animate-spin" /> : <ImagePlus className="size-6" />}
                {uploading > 0 ? "Uploading…" : "Add photos / GIFs / videos"}
              </button>
              <input
                ref={fileInput}
                type="file"
                accept={ACCEPT_MEDIA}
                multiple
                hidden
                onChange={(e) => {
                  if (e.target.files) addTeamPhotos(e.target.files);
                  e.target.value = "";
                }}
              />
            </li>
          </ul>
        </Card>

        <Card title="Portfolio">
          <p className="text-sm text-ink-700">
            Published projects with category <b>{portfolioInfo.category}</b> appear on this page automatically ({portfolioInfo.count} now).{" "}
            <Link href="/admin/projects/new" className="font-semibold text-brand">
              Add a project →
            </Link>
          </p>
        </Card>

        <Card title="Frequently asked questions">
          <div className="space-y-3">
            {d.faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-line p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <input className="field font-semibold" placeholder="Question" value={lv(f.q)} onChange={(e) => set({ faqs: d.faqs.map((x, j) => (j === i ? { ...x, q: lset(x.q, e.target.value) } : x)) })} />
                    <textarea rows={2} className="field" placeholder="Answer" value={lv(f.a)} onChange={(e) => set({ faqs: d.faqs.map((x, j) => (j === i ? { ...x, a: lset(x.a, e.target.value) } : x)) })} />
                  </div>
                  {rowBtns(
                    () => set({ faqs: move(d.faqs, i, -1) }),
                    () => set({ faqs: move(d.faqs, i, 1) }),
                    () => set({ faqs: d.faqs.filter((_, j) => j !== i) }),
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={() => set({ faqs: [...d.faqs, { q: E(), a: E() }] })} className="btn-ghost !px-4 !py-2 text-sm">
              <Plus className="size-4" /> Add question
            </button>
          </div>
        </Card>

        <Card title="Google (SEO)" hint="Title ±60 characters, description ±155. {in} = “in <city>”.">
          {T({ label: `SEO title (${lv(d.seoTitle).length})`, value: d.seoTitle, onChange: (v) => set({ seoTitle: v }) })}
          {T({ label: `Meta description (${lv(d.seoDescription).length})`, value: d.seoDescription, onChange: (v) => set({ seoDescription: v }), rows: 3 })}
        </Card>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-10">
          {msg && (
            <p className={`mr-auto flex items-center gap-2 text-sm ${msg.ok ? "text-green-700" : "text-red-600"}`} role="status">
              {msg.ok ? <Check className="size-4" /> : <CircleAlert className="size-4" />} {msg.text}
            </p>
          )}
          {!msg && dirty && <p className="mr-auto text-sm text-stone">Unsaved changes</p>}
          <button type="button" onClick={save} disabled={saving || uploading > 0} className="btn-primary min-w-32">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Save
          </button>
        </div>
      </div>
    </div>
  );
}
