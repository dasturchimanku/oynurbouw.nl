import Link from "next/link";
import { Media } from "@/components/Media";
import { Layers } from "lucide-react";
import type { Locale, Project } from "@/lib/types";
import { projectPath } from "@/lib/routes";
import { coverOf } from "@/lib/projects";

/** Instagram-profile style grid of square thumbnails. */
export function ProjectGrid({ projects, locale }: { projects: Project[]; locale: Locale }) {
  // Few projects: large cards with visible titles instead of a sparse 3-column grid.
  if (projects.length <= 2) {
    return (
      <ul className="grid grid-cols-1 gap-3 px-4 sm:grid-cols-2 sm:px-0 lg:gap-5">
        {projects.map((p) => {
          const cover = coverOf(p);
          const title = p.title[locale] || p.title.nl;
          return (
            <li key={p.id}>
              <Link href={projectPath(locale, p.slug)} className="group relative block aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-sand">
                {cover && (
                  <Media item={cover} alt={cover.alt[locale] || title} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink">
                  <Layers className="size-3.5" /> {p.images.length}
                </span>
                <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="block text-xl leading-snug font-extrabold">{title}</span>
                  {(p.summary[locale] || p.summary.nl) && (
                    <span className="mt-1 line-clamp-2 block text-sm text-white/80">{p.summary[locale] || p.summary.nl}</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <ul className="grid grid-cols-3 gap-0.5 sm:gap-1.5 lg:gap-3">
      {projects.map((p) => {
        const cover = coverOf(p);
        const title = p.title[locale] || p.title.nl;
        return (
          <li key={p.id}>
            <Link href={projectPath(locale, p.slug)} className="group relative block aspect-square overflow-hidden bg-sand sm:rounded-lg lg:rounded-xl" aria-label={title}>
              {cover && (
                <Media
                  item={cover}
                  alt={cover.alt[locale] || title}
                  fill
                  sizes="(min-width: 1024px) 330px, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              )}
              {p.images.length > 1 && <Layers className="absolute top-2 right-2 size-4 text-white drop-shadow sm:size-5" aria-hidden="true" />}
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-ink/0 to-transparent p-2 opacity-0 transition group-hover:opacity-100 sm:p-3">
                <span className="line-clamp-2 text-xs font-semibold text-white sm:text-sm">{title}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
