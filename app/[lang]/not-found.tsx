"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";

export default function NotFound() {
  const seg = (usePathname() || "/nl").split("/")[1] || "nl";
  const lang = isLocale(seg) ? seg : "nl";
  const t = getDictionary(lang);
  return (
    <section className="pt-36 pb-24">
      <div className="container-x relative text-center">
        <p className="font-display text-[8rem] leading-none font-extrabold text-brand sm:text-[12rem]">404</p>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{t.notFound.title}</h1>
        <p className="mx-auto mt-4 max-w-lg text-stone">{t.notFound.text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href={pagePath(lang, "home")} className="btn-primary">
            {t.notFound.home}
          </Link>
          <Link href={pagePath(lang, "services")} className="btn-ghost">
            {t.nav.services}
          </Link>
          <Link href={pagePath(lang, "projects")} className="btn-ghost">
            {t.nav.projects}
          </Link>
          <Link href={pagePath(lang, "contact")} className="btn-ghost">
            {t.nav.contact}
          </Link>
        </div>
      </div>
    </section>
  );
}
