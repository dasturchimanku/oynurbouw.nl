import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Locale } from "@/lib/types";
import { getDictionary, withCity } from "@/lib/i18n";
import { services } from "@/lib/services";
import { pagePath, servicePath } from "@/lib/routes";
import { buildMetadata, samePaths } from "@/lib/seo";
import { getSettings } from "@/lib/store";
import { PageHero } from "@/components/site/PageHero";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { CtaBanner } from "@/components/site/CtaBanner";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    title: withCity(t.services.metaTitle, (await getSettings()).city, lang),
    description: withCity(t.services.metaDescription, (await getSettings()).city, lang),
    paths: samePaths((l) => pagePath(l, "services")),
  });
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang);
  const settings = await getSettings();
  return (
    <>
      <PageHero
        title={t.services.title}
        text={t.services.text}
        crumbs={[
          { name: t.breadcrumbs.home, path: pagePath(lang, "home") },
          { name: t.nav.services, path: pagePath(lang, "services") },
        ]}
      />
      <section className="container-x pb-8">
        <ul className="grid gap-4 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.key}>
              <Link
                href={servicePath(lang, s.key)}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition duration-300 hover:border-brand/40 hover:shadow-soft sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand transition group-hover:bg-brand group-hover:text-white">
                    <ServiceIcon name={s.icon} className="size-7" />
                  </span>
                  <ArrowRight className="size-6 -rotate-45 text-stone transition group-hover:rotate-0 group-hover:text-brand" />
                </div>
                <h2 className="mt-7 text-2xl font-bold">{s.title[lang]}</h2>
                <p className="mt-3 leading-relaxed text-stone">{s.short[lang]}</p>
                <ul className="mt-6 grid gap-2 text-[15px] text-ink-700 sm:grid-cols-2">
                  {s.includes[lang].slice(0, 4).map((inc) => (
                    <li key={inc} className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0 text-brand" strokeWidth={2.5} />
                      {inc}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBanner locale={lang} settings={settings} />
    </>
  );
}
