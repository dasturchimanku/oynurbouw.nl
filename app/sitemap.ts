import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/types";
import { pagePath, projectPath, servicePath, type PageKey } from "@/lib/routes";
import { services } from "@/lib/services";
import { getPublishedProjects, readDb } from "@/lib/store";
import { landingForService, landingPath } from "@/lib/landings";
import { landingKeys } from "@/lib/types";
import { absoluteUrl } from "@/lib/site";
import { coverOf } from "@/lib/projects";
import { VIDEO_EXT } from "@/lib/media";

export const revalidate = 3600;

function entry(
  pathFor: (l: Locale) => string,
  opts: { priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; lastModified?: string; images?: string[] },
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries([...locales.map((l) => [l, absoluteUrl(pathFor(l))]), ["x-default", absoluteUrl(pathFor("nl"))]]);
  return locales.map((l) => ({
    url: absoluteUrl(pathFor(l)),
    lastModified: opts.lastModified ? new Date(opts.lastModified) : new Date(),
    changeFrequency: opts.changeFrequency,
    priority: l === "nl" ? opts.priority : Math.max(0.1, opts.priority - 0.1),
    alternates: { languages },
    ...(opts.images?.filter((u) => !VIDEO_EXT.test(u)).length ? { images: opts.images.filter((u) => !VIDEO_EXT.test(u)) } : {}),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();
  const { landings } = await readDb();
  const latest = projects.map((p) => p.updatedAt).sort().pop();
  const pages: [PageKey, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["home", 1, "weekly"],
    ["services", 0.9, "monthly"],
    ["projects", 0.9, "weekly"],
    ["about", 0.6, "yearly"],
    ["contact", 0.8, "yearly"],
    ["privacy", 0.2, "yearly"],
  ];
  return [
    ...pages.flatMap(([k, priority, changeFrequency]) =>
      entry((l) => pagePath(l, k), { priority, changeFrequency, lastModified: k === "projects" || k === "home" ? latest : undefined }),
    ),
    ...services.filter((s) => !landingForService(s.key)).flatMap((s) => entry((l) => servicePath(l, s.key), { priority: 0.85, changeFrequency: "monthly" })),
    ...landingKeys.flatMap((k) =>
      entry((l) => landingPath(l, k), {
        priority: 0.95,
        changeFrequency: "weekly",
        images: [landings[k].heroImage?.poster, landings[k].heroImage?.src, ...landings[k].teamImages.map((i) => i.src)].filter((u): u is string => !!u).map((u) => absoluteUrl(u)),
      }),
    ),
    ...projects.flatMap((p) => {
      const cover = coverOf(p);
      return entry((l) => projectPath(l, p.slug), {
        priority: 0.7,
        changeFrequency: "monthly",
        lastModified: p.updatedAt,
        images: [cover, ...p.images.filter((i) => i.id !== cover?.id)].filter(Boolean).slice(0, 10).map((i) => absoluteUrl(i!.src)),
      });
    }),
  ];
}
