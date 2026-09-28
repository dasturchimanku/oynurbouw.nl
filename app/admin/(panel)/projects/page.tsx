import Link from "next/link";
import { Media } from "@/components/Media";
import { ExternalLink, FolderKanban, Pencil, Plus } from "lucide-react";
import { getAllProjects } from "@/lib/store";
import { getService } from "@/lib/services";
import { coverOf } from "@/lib/projects";
import { projectPath } from "@/lib/routes";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";

export const metadata = { title: "Portfolio" };

export default async function AdminProjects() {
  const projects = await getAllProjects();
  return (
    <>
      <PageHeader
        title="Portfolio"
        text="Add, edit and order the projects shown on your website. The order here is the order on the website."
        actions={
          <Link href="/admin/projects/new" className="btn-primary">
            <Plus className="size-4" /> New project
          </Link>
        }
      />
      {projects.length === 0 ? (
        <div className="card flex flex-col items-center p-12 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand">
            <FolderKanban className="size-8" />
          </span>
          <h2 className="mt-5 text-xl font-bold">No projects yet</h2>
          <p className="mt-1 max-w-sm text-stone">Add your first project with photos. It appears on the website as soon as you publish it.</p>
          <Link href="/admin/projects/new" className="btn-primary mt-6">
            <Plus className="size-4" /> Add first project
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {projects.map((p, i) => {
            const cover = coverOf(p);
            return (
              <li key={p.id} className="card flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:pr-5">
                <Link href={`/admin/projects/${p.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                  <span className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                    {cover && <Media item={cover} alt="" fill sizes="80px" className="object-cover" />}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-semibold">{p.title.nl || p.title.en}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.published ? "bg-green-100 text-green-800" : "bg-sand text-stone"}`}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                      {p.featured && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand">Featured</span>}
                    </span>
                    <span className="mt-1 block truncate text-sm text-stone">
                      {[getService(p.category)?.title.en, p.location, p.year, `${p.images.length} photo${p.images.length === 1 ? "" : "s"}`].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </Link>
                <div className="flex items-center gap-1.5">
                  <ProjectRowActions id={p.id} published={p.published} featured={p.featured} first={i === 0} last={i === projects.length - 1} />
                  {p.published && (
                    <a href={projectPath("nl", p.slug)} target="_blank" className="grid size-9 place-items-center rounded-lg border border-line bg-white text-stone hover:text-ink" title="View on website" aria-label="View on website">
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                  <Link href={`/admin/projects/${p.id}`} className="btn-dark !px-4 !py-2">
                    <Pencil className="size-3.5" /> Edit
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
