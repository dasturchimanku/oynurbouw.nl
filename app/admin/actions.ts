"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { destroySession, requireAdmin } from "@/lib/auth";
import { deleteUpload, newId, updateDb } from "@/lib/store";
import { slugify } from "@/lib/site";
import { landingKeys, socialKeys, type Landing, type Project, type Settings } from "@/lib/types";

function refreshSite() {
  // Public pages are statically generated; rebuild them with the new content.
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

const L = z.object({ nl: z.string().trim().max(20000).default(""), en: z.string().trim().max(20000).default("") });

const imageSchema = z.object({
  id: z.string().min(1),
  src: z.string().regex(/^\/media\/[a-zA-Z0-9_-]+\.(webp|jpe?g|png|avif|gif|mp4|m4v|mov|webm)$/),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: L,
  kind: z.enum(["gallery", "before", "after"]),
  media: z.enum(["image", "gif", "video"]).optional(),
  poster: z.string().max(200).optional(),
  webm: z.string().max(200).optional(),
});

const projectSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().max(90).default(""),
  title: L.refine((v) => v.nl.length > 0 || v.en.length > 0, { message: "Title is required" }),
  summary: L,
  description: L,
  category: z.string().trim().max(60),
  location: z.string().trim().max(120).default(""),
  year: z.string().trim().max(10).default(""),
  duration: L,
  images: z.array(imageSchema).max(200),
  coverImageId: z.string().nullable(),
  published: z.boolean(),
  featured: z.boolean(),
  seoTitle: L,
  seoDescription: L,
});

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

export async function saveProject(input: unknown): Promise<SaveResult> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
  const d = parsed.data;
  const now = new Date().toISOString();

  let removed: string[] = [];
  const result = await updateDb<SaveResult>((db) => {
    let slug = slugify(d.slug || d.title.nl || d.title.en) || newId(4);
    const taken = (s: string) => db.projects.some((p) => p.slug === s && p.id !== d.id);
    if (taken(slug)) {
      let n = 2;
      while (taken(`${slug}-${n}`)) n++;
      slug = `${slug}-${n}`;
    }
    const coverImageId = d.images.some((i) => i.id === d.coverImageId) ? d.coverImageId : d.images[0]?.id ?? null;

    if (d.id) {
      const existing = db.projects.find((p) => p.id === d.id);
      if (!existing) return { ok: false, error: "Project not found" };
      const keep = new Set(d.images.map((i) => i.src));
      removed = existing.images.map((i) => i.src).filter((src) => !keep.has(src));
      Object.assign(existing, { ...d, slug, coverImageId, updatedAt: now });
      return { ok: true, id: existing.id };
    }
    const project: Project = {
      ...d,
      id: newId(),
      slug,
      coverImageId,
      order: Math.min(0, ...db.projects.map((p) => p.order)) - 1,
      createdAt: now,
      updatedAt: now,
    };
    db.projects.push(project);
    return { ok: true, id: project.id };
  });

  await Promise.all(removed.map(deleteUpload));
  refreshSite();
  return result;
}

export async function deleteProject(id: string) {
  await requireAdmin();
  let images: string[] = [];
  await updateDb((db) => {
    const p = db.projects.find((x) => x.id === id);
    if (p) images = p.images.map((i) => i.src);
    db.projects = db.projects.filter((x) => x.id !== id);
  });
  await Promise.all(images.map(deleteUpload));
  refreshSite();
  redirect("/admin/projects");
}

export async function toggleProject(id: string, field: "published" | "featured") {
  await requireAdmin();
  await updateDb((db) => {
    const p = db.projects.find((x) => x.id === id);
    if (p) {
      p[field] = !p[field];
      p.updatedAt = new Date().toISOString();
    }
  });
  refreshSite();
}

export async function moveProject(id: string, dir: -1 | 1) {
  await requireAdmin();
  await updateDb((db) => {
    const list = [...db.projects].sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt));
    const i = list.findIndex((p) => p.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    list.forEach((p, idx) => {
      const orig = db.projects.find((x) => x.id === p.id)!;
      orig.order = idx;
    });
  });
  refreshSite();
}

/* ── Settings ──────────────────────────────────────────── */

const optionalImage = imageSchema.nullable();
const url = z.union([z.literal(""), z.string().trim().url().max(300)]);

const settingsSchema = z.object({
  companyName: z.string().trim().min(1).max(120),
  tagline: L,
  phone: z.string().trim().max(40),
  whatsapp: z.string().trim().max(40),
  email: z.union([z.literal(""), z.string().trim().email()]),
  street: z.string().trim().max(120),
  postalCode: z.string().trim().max(12),
  city: z.string().trim().max(80),
  country: z.string().trim().max(2).default("NL"),
  kvk: z.string().trim().max(20),
  btw: z.string().trim().max(20),
  iban: z.string().trim().max(40),
  serviceArea: L,
  openingHours: L,
  socials: z.object(Object.fromEntries(socialKeys.map((k) => [k, url])) as Record<(typeof socialKeys)[number], typeof url>),
  stats: z.object({
    yearsExperience: z.string().trim().max(12),
    projectsCompleted: z.string().trim().max(12),
    rating: z.string().trim().max(12),
  }),
  heroImage: optionalImage,
  aboutImage: optionalImage,
});

export async function saveSettings(input: unknown): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
  const d = parsed.data;
  let removed: string[] = [];
  await updateDb((db) => {
    const old = db.settings;
    removed = [old.heroImage?.src, old.aboutImage?.src].filter(
      (s): s is string => !!s && s !== d.heroImage?.src && s !== d.aboutImage?.src,
    );
    db.settings = { ...old, ...d, updatedAt: new Date().toISOString() } as Settings;
  });
  await Promise.all(removed.map(deleteUpload));
  refreshSite();
  return { ok: true };
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ── Landing pages ─────────────────────────────────────── */

const landingSchema = z.object({
  key: z.enum(landingKeys),
  published: z.boolean(),
  eyebrow: L,
  title: L,
  titleAccent: L,
  text: L,
  heroImage: optionalImage,
  usps: z.array(L).max(6),
  servicesTitle: L,
  services: z.array(z.object({ title: L, text: L })).max(20),
  prices: z
    .array(
      z.object({
        id: z.string().min(1).max(40),
        name: L,
        price: z.number().min(0).max(100000),
        unit: L,
        calc: z.boolean(),
        note: L,
      }),
    )
    .max(30),
  priceNote: L,
  teamTitle: L,
  teamText: L,
  teamImages: z.array(imageSchema).max(30),
  faqs: z.array(z.object({ q: L, a: L })).max(30),
  seoTitle: L,
  seoDescription: L,
});

export async function saveLanding(input: unknown): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const parsed = landingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
  const d = parsed.data;
  let removed: string[] = [];
  await updateDb((db) => {
    const old = db.landings[d.key];
    const keep = new Set([d.heroImage?.src, ...d.teamImages.map((i) => i.src)]);
    removed = [old?.heroImage?.src, ...(old?.teamImages || []).map((i) => i.src)].filter((s): s is string => !!s && !keep.has(s));
    db.landings[d.key] = { ...d, updatedAt: new Date().toISOString() } as Landing;
  });
  await Promise.all(removed.map(deleteUpload));
  refreshSite();
  return { ok: true };
}
