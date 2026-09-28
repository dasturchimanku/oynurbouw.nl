import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Database, Landing, LandingKey, Project, Settings } from "./types";
import { landingKeys } from "./types";
import { defaultLandings } from "./landings";
import { socialKeys } from "./types";

/**
 * Tiny file-based database.
 *
 * All content lives in `storage/db.json` and uploaded photos in `storage/uploads`.
 * This keeps the website dependency-free (no database server needed) and makes
 * backups trivial: copy the `storage` folder. Writes are serialized and atomic.
 */

export const STORAGE_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.STORAGE_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "storage"));
export const UPLOAD_DIR = path.join(STORAGE_DIR, "uploads");
const DB_FILE = path.join(STORAGE_DIR, "db.json");

const emptyL = () => ({ nl: "", en: "" });

/** Official company details — used whenever a field is left empty in the admin panel. */
export function defaultSettings(): Settings {
  return {
    companyName: "Oynur Bouw B.V.",
    tagline: {
      nl: "Badkamers, vloeren, tegel- en schilderwerk. Vakkundig, netjes en volgens afspraak.",
      en: "Bathrooms, floors, tiling and painting. Skilled, tidy and as agreed.",
    },
    phone: "085 333 2537",
    whatsapp: "085 333 2537",
    email: "info@oynurbouw.nl",
    street: "",
    postalCode: "",
    city: "",
    country: "NL",
    kvk: "42156292",
    btw: "NL869962279B01",
    iban: "NL18INGB0118060724",
    serviceArea: { nl: "", en: "" },
    openingHours: { nl: "Ma – Vr: 08:00 – 18:00\nZa: op afspraak", en: "Mon – Fri: 08:00 – 18:00\nSat: by appointment" },
    socials: {
      ...(Object.fromEntries(socialKeys.map((k) => [k, ""])) as Settings["socials"]),
      instagram: "https://www.instagram.com/oynurbouw.nl/",
      facebook: "https://www.facebook.com/oynurbouw.nl",
      tiktok: "https://www.tiktok.com/@oynurbouw.nl",
    },
    stats: { yearsExperience: "", projectsCompleted: "", rating: "" },
    heroImage: null,
    aboutImage: null,
    updatedAt: new Date().toISOString(),
  };
}

function emptyDb(): Database {
  return { version: 1, settings: defaultSettings(), projects: [], landings: defaultLandings() };
}

/** Merge stored data onto defaults so new fields never break old databases. */
function normalize(raw: Partial<Database>): Database {
  const base = emptyDb();
  const s = { ...base.settings, ...(raw.settings || {}) } as Settings;
  // Empty text fields fall back to the official company details.
  for (const k of ["companyName", "phone", "whatsapp", "email", "kvk", "btw", "iban"] as const) {
    if (!s[k]) s[k] = base.settings[k];
  }
  s.socials = { ...base.settings.socials };
  for (const [k, v] of Object.entries(raw.settings?.socials || {})) {
    if (v && /^https?:\/\/[^/]+\.[a-z]{2,}/i.test(v)) s.socials[k as keyof Settings["socials"]] = v;
  }
  s.stats = { ...base.settings.stats, ...(raw.settings?.stats || {}) };
  const projects = (raw.projects || []).map((p) => ({
    ...{
      summary: emptyL(),
      description: emptyL(),
      duration: emptyL(),
      seoTitle: emptyL(),
      seoDescription: emptyL(),
      images: [],
      coverImageId: null,
      featured: false,
      published: false,
      order: 0,
      location: "",
      year: "",
    },
    ...p,
  })) as Project[];
  const defaults = defaultLandings();
  const landings = Object.fromEntries(
    landingKeys.map((k) => [k, { ...defaults[k], ...((raw.landings as Partial<Record<LandingKey, Landing>> | undefined)?.[k] || {}), key: k }]),
  ) as Record<LandingKey, Landing>;
  return { version: 1, settings: s, projects, landings };
}

/** Always reads the file fresh (it is tiny), so edits are visible immediately — also after copying db.json by hand. */
export async function readDb(): Promise<Database> {
  try {
    const text = await fs.readFile(DB_FILE, "utf8");
    return normalize(JSON.parse(text));
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      const db = emptyDb();
      await writeFileAtomic(db);
      return db;
    }
    throw err;
  }
}

async function writeFileAtomic(db: Database) {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.${Date.now()}.tmp`;
  const data = JSON.stringify(db, null, 2);
  await fs.writeFile(tmp, data, "utf8");
  try {
    await fs.rename(tmp, DB_FILE);
  } catch {
    // Windows can refuse to replace a file that is briefly locked (antivirus, indexer).
    await fs.writeFile(DB_FILE, data, "utf8");
    await fs.rm(tmp, { force: true });
  }
}

let queue: Promise<unknown> = Promise.resolve();

/** Serialized read-modify-write. */
export function updateDb<T>(fn: (db: Database) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDb();
    const result = await fn(db);
    await writeFileAtomic(db);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

export function newId(bytes = 8) {
  return crypto.randomBytes(bytes).toString("hex");
}

/* ── Query helpers ─────────────────────────────────────────── */

export async function getSettings() {
  return (await readDb()).settings;
}

function sortProjects(a: Project, b: Project) {
  return a.order - b.order || b.createdAt.localeCompare(a.createdAt);
}

export async function getPublishedProjects() {
  return (await readDb()).projects.filter((p) => p.published).sort(sortProjects);
}

export async function getAllProjects() {
  return (await readDb()).projects.sort(sortProjects);
}

export async function getProjectBySlug(slug: string) {
  return (await readDb()).projects.find((p) => p.slug === slug) || null;
}

export async function getProjectById(id: string) {
  return (await readDb()).projects.find((p) => p.id === id) || null;
}

/** Deletes an uploaded photo — but only if no project or setting still uses it. */
export async function deleteUpload(src: string) {
  if (!src.startsWith("/media/")) return;
  const db = await readDb();
  const used = [
    db.settings.heroImage?.src,
    db.settings.aboutImage?.src,
    ...db.projects.flatMap((p) => p.images.map((i) => i.src)),
    ...Object.values(db.landings).flatMap((l) => [l.heroImage?.src, ...l.teamImages.map((i) => i.src)]),
    ...Object.values(defaultLandings()).flatMap((l) => [l.heroImage?.src, ...l.teamImages.map((i) => i.src)]),
  ];
  if (used.includes(src)) return;
  const file = path.basename(src);
  await fs.rm(path.join(UPLOAD_DIR, file), { force: true }).catch(() => undefined);
}

export async function getLanding(key: LandingKey) {
  return (await readDb()).landings[key];
}
