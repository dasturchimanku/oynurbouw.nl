import type { Metadata } from "next";
import { Media } from "@/components/Media";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/types";
import { getDictionary, withCity } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import { buildMetadata, samePaths } from "@/lib/seo";
import { getSettings } from "@/lib/store";
import { PageHero } from "@/components/site/PageHero";
import { CtaBanner } from "@/components/site/CtaBanner";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  const s = await getSettings();
  return buildMetadata({
    locale: lang,
    title: withCity(t.about.metaTitle, s.city, lang),
    description: t.about.metaDescription,
    paths: samePaths((l) => pagePath(l, "about")),
  });
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang);
  const settings = await getSettings();
  const img = settings.aboutImage || settings.heroImage;
  return (
    <>
      <PageHero
        title={t.about.title}
        text={t.about.lead}
        crumbs={[
          { name: t.breadcrumbs.home, path: pagePath(lang, "home") },
          { name: t.nav.about, path: pagePath(lang, "about") },
        ]}
      />
      <section className="container-x grid grid-cols-1 gap-10 pb-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        {img && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-sand lg:order-2 lg:aspect-[4/5]">
            <Media item={img} alt={img.alt[lang] || t.about.title} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        )}
        <div>
          <div className="prose-ob text-lg">
            {t.about.body.map((p) => (
              <p key={p.slice(0, 30)}>{p}</p>
            ))}
          </div>
          <h2 className="mt-10 text-2xl font-extrabold">{t.about.valuesTitle}</h2>
          <ul className="mt-5 space-y-4">
            {t.about.values.map((v) => (
              <li key={v.t} className="border-l-2 border-brand pl-4">
                <h3 className="font-bold">{v.t}</h3>
                <p className="text-stone">{v.d}</p>
              </li>
            ))}
          </ul>
          <Link href={pagePath(lang, "projects")} className="btn-ghost mt-8">
            {t.home.heroCta2} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <CtaBanner locale={lang} settings={settings} />
    </>
  );
}
