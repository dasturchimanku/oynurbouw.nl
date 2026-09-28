import type { Locale } from "./types";
import { getService } from "./services";
import { landingForService, landingPath } from "./landings";

const seg = {
  nl: { services: "diensten", projects: "projecten", about: "over-ons", contact: "contact", privacy: "privacy" },
  en: { services: "services", projects: "projects", about: "about", contact: "contact", privacy: "privacy" },
} as const;

export type PageKey = "home" | "services" | "projects" | "about" | "contact" | "privacy";

export function pagePath(locale: Locale, page: PageKey) {
  if (page === "home") return `/${locale}`;
  return `/${locale}/${seg[locale][page]}`;
}

export function servicePath(locale: Locale, key: string) {
  const landing = landingForService(key);
  if (landing) return landingPath(locale, landing);
  const s = getService(key);
  return `${pagePath(locale, "services")}/${s ? s.slug[locale] : key}`;
}

export function projectPath(locale: Locale, slug: string) {
  return `${pagePath(locale, "projects")}/${slug}`;
}
