import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export function PageHero({ eyebrow, title, text, crumbs, children }: { eyebrow?: string; title: string; text?: string; crumbs: Crumb[]; children?: ReactNode }) {
  return (
    <section className="pt-24 pb-10 lg:pt-36 lg:pb-14">
      <div className="container-x">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
        <h1 className="mt-3 max-w-4xl text-[2.25rem] leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone">{text}</p>}
        {children}
      </div>
    </section>
  );
}
