import Link from "next/link";
import { Media } from "@/components/Media";
import type { Locale, Project } from "@/lib/types";
import { projectPath } from "@/lib/routes";
import { getService } from "@/lib/services";
import { coverOf } from "@/lib/projects";

export function ProjectCard({ project, locale, priority }: { project: Project; locale: Locale; priority?: boolean }) {
  const cover = coverOf(project);
  const service = getService(project.category);
  const title = project.title[locale] || project.title.nl;
  return (
    <Link href={projectPath(locale, project.slug)} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
        {cover && (
          <Media
            item={cover}
            alt={cover.alt[locale] || title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
          {project.images.length} {locale === "nl" ? "foto's" : "photos"}
        </span>
      </div>
      <h3 className="mt-3 text-lg leading-snug font-bold group-hover:text-brand">{title}</h3>
      <p className="mt-0.5 text-sm text-stone">
        {[service?.title[locale], project.location, project.year].filter(Boolean).join(" · ")}
      </p>
    </Link>
  );
}
