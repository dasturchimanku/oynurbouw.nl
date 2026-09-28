import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { landingForService, landingPath } from "@/lib/landings";
import { Check, ChevronDown, Phone } from "lucide-react";
import type { Locale } from "@/lib/types";
import { locales } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { services, getServiceBySlug } from "@/lib/services";
import { pagePath, servicePath } from "@/lib/routes";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { getPublishedProjects, getSettings } from "@/lib/store";
import { absoluteUrl, siteUrl, telHref } from "@/lib/site";
import { PageHero } from "@/components/site/PageHero";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { ProjectCard } from "@/components/site/ProjectCard";
import { CtaBanner } from "@/components/site/CtaBanner";
import { JsonLd } from "@/components/JsonLd";
import { SocialIcon } from "@/components/SocialIcon";
import { waLink } from "@/lib/contact";
import { withCity } from "@/lib/i18n";

type Props = { params: Promise<{ lang: Locale; slug: string }> };

export const dynamicParams = true;

export function generateStaticParams() {
  return locales.flatMap((lang) => services.filter((s) => !landingForService(s.key)).map((s) => ({ lang, slug: s.slug[lang] })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const s = getServiceBySlug(lang, slug);
  if (!s) return {};
  const settings = await getSettings();
  return buildMetadata({
    locale: lang,
    title: withCity(`${s.title[lang]}{in}`, settings.city, lang),
    description: s.metaDescription[lang],
    paths: { nl: servicePath("nl", s.key), en: servicePath("en", s.key) },
  });
}

export default async function ServicePage({ params }: Props) {
  const { lang, slug } = await params;
  const service = getServiceBySlug(lang, slug);
  if (!service) notFound();
  const landing = landingForService(service.key);
  if (landing) permanentRedirect(landingPath(lang, landing));
  const t = getDictionary(lang);
  const [settings, projects] = await Promise.all([getSettings(), getPublishedProjects()]);
  const related = projects.filter((p) => p.category === service.key).slice(0, 3);
  const others = services.filter((s) => s.key !== service.key);
  const faqs = service.faqs[lang];
  const wa = waLink(settings, lang, { about: service.title[lang] });

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title[lang],
    description: service.metaDescription[lang],
    serviceType: service.title[lang],
    url: absoluteUrl(servicePath(lang, service.key)),
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: settings.serviceArea[lang] || "Nederland",
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}
      <PageHero
        eyebrow={t.nav.services}
        title={service.title[lang]}
        text={service.short[lang]}
        crumbs={[
          { name: t.breadcrumbs.home, path: pagePath(lang, "home") },
          { name: t.nav.services, path: pagePath(lang, "services") },
          { name: service.title[lang], path: servicePath(lang, service.key) },
        ]}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn h-14 bg-[#25D366] !px-7 text-base text-white hover:bg-[#1ebe5b]">
            <SocialIcon name="whatsapp" className="size-5" /> {t.wa.button}
          </a>
          {settings.phone && (
            <a href={telHref(settings.phone)} className="btn-ghost h-14 !px-7 text-base">
              <Phone className="size-4" /> {settings.phone}
            </a>
          )}
        </div>
      </PageHero>

      <section className="container-x grid grid-cols-1 gap-12 pb-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16 lg:pb-24">
        <div>
          <div className="prose-ob text-lg">
            {service.intro[lang].map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          {faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-extrabold sm:text-3xl">{t.services.faq}</h2>
              <div className="mt-6 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white">
                {faqs.map((f) => (
                  <details key={f.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                      <h3>{f.q}</h3>
                      <ChevronDown className="size-5 shrink-0 text-brand transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 leading-relaxed text-stone">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-7 sm:p-8">
            <span className="grid size-14 place-items-center rounded-2xl bg-brand text-white">
              <ServiceIcon name={service.icon} className="size-7" />
            </span>
            <h2 className="mt-6 text-xl font-bold">{t.services.includes}</h2>
            <ul className="mt-5 space-y-3">
              {service.includes[lang].map((inc) => (
                <li key={inc} className="flex gap-3 text-ink-700">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {inc}
                </li>
              ))}
            </ul>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn mt-8 h-12 w-full bg-[#25D366] text-white hover:bg-[#1ebe5b]">
              <SocialIcon name="whatsapp" className="size-4" /> {t.wa.button}
            </a>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="py-12">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold sm:text-3xl">{t.services.related}</h2>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.id}>
                  <ProjectCard project={p} locale={lang} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="container-x pt-12">
        <h2 className="text-2xl font-extrabold sm:text-3xl">{t.services.other}</h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {others.map((s) => (
            <li key={s.key}>
              <Link
                href={servicePath(lang, s.key)}
                className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white py-2 pr-5 pl-2 font-medium transition hover:border-brand hover:text-brand"
              >
                <span className="grid size-8 place-items-center rounded-full bg-brand-50 text-brand">
                  <ServiceIcon name={s.icon} className="size-4" />
                </span>
                {s.title[lang]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBanner
        locale={lang}
        settings={settings}
        about={service.title[lang]}
        title={t.services.ctaTitle.replace("{topic}", service.title[lang].toLowerCase())}
        text={t.services.ctaText}
      />
    </>
  );
}
