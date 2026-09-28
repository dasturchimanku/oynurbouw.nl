import Link from "next/link";
import { Media } from "@/components/Media";
import { ExternalLink, Pencil } from "lucide-react";
import { readDb } from "@/lib/store";
import { landingKeys } from "@/lib/types";
import { landingMeta, landingPath } from "@/lib/landings";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata = { title: "Landing pages" };

export default async function LandingsAdmin() {
  const { landings, projects } = await readDb();
  return (
    <>
      <PageHeader title="Landing pages" text="Dedicated pages for Stucwerk and Schilderwerk: texts, photos, prices and FAQs." />
      <ul className="grid gap-4 sm:grid-cols-2">
        {landingKeys.map((k) => {
          const l = landings[k];
          const count = projects.filter((p) => p.published && p.category === landingMeta[k].serviceKey).length;
          return (
            <li key={k} className="card overflow-hidden">
              <div className="relative aspect-[16/9] bg-sand">
                {l.heroImage && <Media item={l.heroImage} alt="" fill sizes="400px" className="object-cover" />}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{landingMeta[k].label.nl}</h2>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${l.published ? "bg-green-100 text-green-800" : "bg-sand text-stone"}`}>
                    {l.published ? "Published" : "Hidden"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone">
                  {l.prices.length} prices · {l.teamImages.length} team photos · {count} portfolio project(s)
                </p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/landings/${k}`} className="btn-dark !px-4 !py-2">
                    <Pencil className="size-3.5" /> Edit
                  </Link>
                  <a href={landingPath("nl", k)} target="_blank" className="btn-ghost !px-4 !py-2">
                    <ExternalLink className="size-3.5" /> View
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
