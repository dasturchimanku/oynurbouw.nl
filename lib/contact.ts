import type { Locale, Settings } from "./types";
import { getDictionary } from "./i18n";
import { telHref, whatsappHref } from "./site";

/** WhatsApp link with a pre-filled message in the visitor's language. */
export function waLink(settings: Settings, locale: Locale, opts?: { about?: string; project?: string }) {
  const t = getDictionary(locale).wa;
  const text = opts?.project
    ? t.messageProject.replace("{topic}", opts.project)
    : opts?.about
      ? t.messageAbout.replace("{topic}", opts.about.toLowerCase())
      : t.message;
  return whatsappHref(settings.whatsapp || settings.phone, text);
}

export function phoneLink(settings: Settings) {
  return settings.phone ? telHref(settings.phone) : "";
}
