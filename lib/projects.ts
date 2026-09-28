import type { Project } from "./types";

export function coverOf(project: Project) {
  return (
    project.images.find((i) => i.id === project.coverImageId) ||
    project.images.find((i) => i.kind !== "before") ||
    project.images[0] ||
    null
  );
}

export type Draft = Omit<Project, "id" | "createdAt" | "updatedAt" | "order"> & { id?: string };

export function newDraft(): Draft {
  const e = () => ({ nl: "", en: "" });
  return {
    slug: "",
    title: e(),
    summary: e(),
    description: e(),
    category: "",
    location: "",
    year: String(new Date().getFullYear()),
    duration: e(),
    images: [],
    coverImageId: null,
    published: false,
    featured: false,
    seoTitle: e(),
    seoDescription: e(),
  };
}
