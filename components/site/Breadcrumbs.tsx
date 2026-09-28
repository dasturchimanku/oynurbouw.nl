import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, dark }: { items: Crumb[]; dark?: boolean }) {
  if (items.length < 2) return null;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb">
        <ol className={`flex flex-wrap items-center gap-1.5 text-sm ${dark ? "text-white/55" : "text-stone"}`}>
          {items.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />}
              {i === items.length - 1 ? (
                <span aria-current="page" className={dark ? "text-white/90" : "text-ink"}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className={dark ? "hover:text-white" : "hover:text-ink"}>
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
