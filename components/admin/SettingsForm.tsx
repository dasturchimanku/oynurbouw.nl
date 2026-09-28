"use client";

import { useState, useTransition } from "react";
import { Check, CircleAlert, Loader2 } from "lucide-react";
import type { Locale, Settings, SocialKey } from "@/lib/types";
import { socialKeys } from "@/lib/types";
import { socialMeta } from "@/lib/socials";
import { saveSettings } from "@/app/admin/actions";
import { SocialIcon } from "@/components/SocialIcon";
import { SingleImageField } from "./SingleImageField";

type Editable = Omit<Settings, "updatedAt">;

export function SettingsForm({ initial }: { initial: Editable }) {
  const [s, setS] = useState<Editable>(initial);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = <K extends keyof Editable>(k: K, v: Editable[K]) => {
    setS((p) => ({ ...p, [k]: v }));
    setMsg(null);
  };
  const setLoc = (k: "tagline" | "serviceArea" | "openingHours", l: Locale, v: string) => set(k, { ...s[k], [l]: v });
  const setSocial = (k: SocialKey, v: string) => set("socials", { ...s.socials, [k]: v });

  function normalizeUrl(v: string) {
    const t = v.trim();
    if (!t) return "";
    return /^https?:\/\//i.test(t) ? t : `https://${t.replace(/^\/+/, "")}`;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...s, socials: Object.fromEntries(socialKeys.map((k) => [k, normalizeUrl(s.socials[k])])) as Settings["socials"] };
    setS(payload);
    start(async () => {
      try {
        const res = await saveSettings(payload);
        setMsg(res.ok ? { ok: true, text: "Settings saved. The website has been updated." } : { ok: false, text: res.error || "Error" });
      } catch (e) {
        setMsg({ ok: false, text: `Could not save (${(e as Error).message || "server error"}). Refresh and try again.` });
      }
    });
  }

  const text = (label: string, key: "companyName" | "phone" | "whatsapp" | "email" | "street" | "postalCode" | "city" | "kvk" | "btw" | "iban", placeholder = "", type = "text") => (
    <div>
      <label className="label" htmlFor={key}>
        {label}
      </label>
      <input id={key} type={type} className="field" value={s[key]} placeholder={placeholder} onChange={(e) => set(key, e.target.value)} />
    </div>
  );
  const bilingual = (label: string, key: "tagline" | "serviceArea" | "openingHours", rows = 1) => (
    <div className="grid gap-3 sm:grid-cols-2">
      {(["nl", "en"] as Locale[]).map((l) => (
        <div key={l}>
          <label className="label" htmlFor={`${key}-${l}`}>
            {label} <span className="font-normal text-stone">({l.toUpperCase()})</span>
          </label>
          {rows > 1 ? (
            <textarea id={`${key}-${l}`} rows={rows} className="field" value={s[key][l]} onChange={(e) => setLoc(key, l, e.target.value)} />
          ) : (
            <input id={`${key}-${l}`} className="field" value={s[key][l]} onChange={(e) => setLoc(key, l, e.target.value)} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-6 pb-24">
      <section className="card space-y-4 p-6">
        <h2 className="text-lg font-bold">Contact details</h2>
        <p className="-mt-2 text-sm text-stone">Shown in the header, footer, contact page and in Google (structured data).</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {text("Company name", "companyName")}
          {text("Email", "email", "info@…", "email")}
          {text("Phone", "phone", "+31 6 12345678", "tel")}
          {text("WhatsApp number", "whatsapp", "Number customers message on WhatsApp", "tel")}
        </div>
        {bilingual("Tagline", "tagline")}
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="text-lg font-bold">Address & registration</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-3">{text("Street + number", "street")}</div>
          {text("Postcode", "postalCode", "1234 AB")}
          {text("City (used in Google texts)", "city", "e.g. Haarlem")}
          <div>
            <label className="label" htmlFor="country">
              Country code
            </label>
            <input id="country" className="field" maxLength={2} value={s.country} onChange={(e) => set("country", e.target.value.toUpperCase())} />
          </div>
          {text("KvK number", "kvk")}
          {text("BTW / VAT number", "btw", "NL…B01")}
          {text("IBAN", "iban")}
        </div>
        {bilingual("Service area (e.g. Haarlem en omgeving)", "serviceArea")}
        {bilingual("Opening hours", "openingHours", 3)}
      </section>

      <section id="socials" className="card scroll-mt-6 space-y-4 p-6">
        <h2 className="text-lg font-bold">Social media profiles</h2>
        <p className="-mt-2 text-sm text-stone">
          Paste the full link to each profile. Filled-in profiles appear in the footer, on the contact page, in a &ldquo;Follow our
          work&rdquo; section, and are linked to your business in Google (sameAs). Leave empty to hide.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {socialKeys.map((k) => (
            <div key={k}>
              <label className="label flex items-center gap-2" htmlFor={`social-${k}`}>
                <SocialIcon name={k} className="size-4 text-stone" /> {socialMeta[k].label}
              </label>
              <input
                id={`social-${k}`}
                className="field"
                inputMode="url"
                placeholder={socialMeta[k].placeholder}
                value={s.socials[k]}
                onChange={(e) => setSocial(k, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <section id="images" className="card scroll-mt-6 space-y-6 p-6">
        <h2 className="text-lg font-bold">Website photos</h2>
        <SingleImageField
          label="Homepage photo"
          hint="Large photo next to the headline on the homepage. Portrait or square works best."
          value={s.heroImage}
          onChange={(v) => set("heroImage", v)}
        />
        <SingleImageField label="About page photo" hint="E.g. a team photo or you at work." value={s.aboutImage} onChange={(v) => set("aboutImage", v)} />
      </section>


      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-10">
          {msg && (
            <p className={`mr-auto flex items-center gap-2 text-sm ${msg.ok ? "text-green-700" : "text-red-600"}`} role="status">
              {msg.ok ? <Check className="size-4" /> : <CircleAlert className="size-4" />} {msg.text}
            </p>
          )}
          <button className="btn-primary min-w-40" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Save settings
          </button>
        </div>
      </div>
    </form>
  );
}
