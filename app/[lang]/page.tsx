import type { Metadata } from "next";
import { Media } from "@/components/Media";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { getDictionary, withCity } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { getPublishedProjects, getSettings, readDb } from "@/lib/store";
import { landingKeys } from "@/lib/types";
import { landingMeta, landingPath } from "@/lib/landings";
import { services } from "@/lib/services";
import { pagePath, projectPath, servicePath } from "@/lib/routes";
import { buildMetadata, samePaths } from "@/lib/seo";
import { coverOf } from "@/lib/projects";
import { waLink } from "@/lib/contact";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { CtaBanner } from "@/components/site/CtaBanner";
import { SocialIcon } from "@/components/SocialIcon";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  const s = await getSettings();
  const title = `Oynur Bouw | ${withCity(t.home.metaTitle, s.city, lang)}`;
  return buildMetadata({
    locale: lang,
    title,
    absoluteTitle: true,
    description: withCity(t.home.metaDescription, s.city, lang),
    paths: samePaths((l) => pagePath(l, "home")),
    ...(s.heroImage ? { images: [{ url: s.heroImage.src, width: s.heroImage.width, height: s.heroImage.height, alt: s.heroImage.alt[lang] }] } : {}),
  });
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang);
  const [settings, projects, { landings }] = await Promise.all([getSettings(), getPublishedProjects(), readDb()]);
  const featured = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(0, 6);
  const hero = settings.heroImage || (featured[0] ? coverOf(featured[0]) : null);

  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-20 lg:pt-28">
        <div className="container-x grid grid-cols-1 items-center gap-8 py-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <div className="animate-fade-up">
            <p className="eyebrow">{withCity(t.home.eyebrow, settings.city, lang)}</p>
            <h1 className="mt-4 text-[2.5rem] leading-[1.04] font-extrabold sm:text-6xl xl:text-7xl">
              {t.home.heroTitle} <span className="text-brand">{t.home.heroTitleAccent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-stone sm:text-lg">{t.home.heroText}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={waLink(settings, lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn h-14 bg-[#25D366] !px-7 text-base text-white hover:bg-[#1ebe5b]"
              >
                <SocialIcon name="whatsapp" className="size-5" /> {t.wa.button}
              </a>
              <Link href={pagePath(lang, "projects")} className="btn-ghost h-14 !px-7 text-base">
                {t.home.heroCta2} <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul className="mt-7 flex flex-col gap-2 text-[15px] text-ink-700 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {t.home.usp.map((u) => (
                <li key={u} className="flex items-center gap-2">
                  <Check className="size-4 text-brand" strokeWidth={3} /> {u}
                </li>
              ))}
            </ul>
          </div>

          {hero && (
            <div className="relative animate-fade-up [animation-delay:120ms]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand sm:aspect-[4/3] lg:aspect-[4/5]">
                <Media
                  item={hero}
                  alt={hero.alt[lang] || hero.alt.nl}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Featured trades: Stucwerk / Schilderwerk ── */}
      <section className="container-x pt-10 lg:pt-16" aria-label={lang === "nl" ? "Specialisaties" : "Specialities"}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:gap-5">
          {landingKeys
            .filter((k) => landings[k].published)
            .map((k) => {
              const l = landings[k];
              const img = l.heroImage;
              const cheapest = l.prices.filter((p) => p.price > 0).sort((a, b) => a.price - b.price)[0];
              return (
                <li key={k}>
                  <Link href={landingPath(lang, k)} className="group relative block aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-ink sm:aspect-[5/4] lg:aspect-[16/11]">
                    {img && (
                      <Media
                        item={img}
                        alt={img.alt[lang] || landingMeta[k].label[lang]}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover opacity-90 transition duration-700 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-7">
                      <span>
                        <span className="block font-display text-2xl font-extrabold sm:text-3xl">{landingMeta[k].label[lang]}</span>
                        {cheapest && (
                          <span className="mt-1 block text-sm text-white/80">
                            {lang === "nl" ? "vanaf" : "from"} €{cheapest.price} {cheapest.unit[lang]}
                          </span>
                        )}
                      </span>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white transition group-hover:scale-110">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </section>

      {/* ── Services ── */}
      <section className="container-x pt-14 pb-16 lg:pt-20 lg:pb-24" aria-labelledby="services-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="services-title" className="text-3xl font-extrabold sm:text-4xl">
              {t.home.servicesTitle}
            </h2>
            <p className="mt-2 text-stone">{t.home.servicesText}</p>
          </div>
          <Link href={pagePath(lang, "services")} className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand sm:inline-flex">
            {t.home.allServices} <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {services.map((s) => (
            <li key={s.key}>
              <Link
                href={servicePath(lang, s.key)}
                className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-line bg-white p-4 transition hover:border-brand/40 hover:shadow-soft sm:p-5"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand transition group-hover:bg-brand group-hover:text-white">
                  <ServiceIcon name={s.icon} className="size-5" />
                </span>
                <span className="flex items-end justify-between gap-2">
                  <h3 className="text-[15px] leading-snug font-bold sm:text-base">{s.title[lang]}</h3>
                  <ArrowUpRight className="size-4 shrink-0 text-stone transition group-hover:text-brand" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Projects ── */}
      {featured.length > 0 && (
        <section className="py-4 lg:py-8" aria-labelledby="projects-title">
          <div className="container-x flex items-end justify-between gap-4">
            <div>
              <h2 id="projects-title" className="text-3xl font-extrabold sm:text-4xl">
                {t.home.projectsTitle}
              </h2>
              <p className="mt-2 text-stone">{t.home.projectsText}</p>
            </div>
            <Link href={pagePath(lang, "projects")} className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand sm:inline-flex">
              {t.home.allProjects} <ArrowRight className="size-4" />
            </Link>
          </div>
          {/* Mobile: swipeable row. Desktop: grid. */}
          <ul className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-8">
            {featured.map((p, i) => {
              const cover = coverOf(p);
              const title = p.title[lang] || p.title.nl;
              return (
                <li key={p.id} className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-auto lg:[&:nth-child(n+4)]:hidden">
                  <Link href={projectPath(lang, p.slug)} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
                      {cover && (
                        <Media
                          item={cover}
                          alt={cover.alt[lang] || title}
                          fill
                          loading={i < 2 ? "eager" : "lazy"}
                          sizes="(min-width: 1024px) 33vw, 78vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <h3 className="mt-3 text-base leading-snug font-bold group-hover:text-brand">{title}</h3>
                    <p className="mt-0.5 text-sm text-stone">
                      {services.find((s) => s.key === p.category)?.title[lang]}
                      {p.location ? ` · ${p.location}` : ""}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="container-x mt-6 sm:hidden">
            <Link href={pagePath(lang, "projects")} className="btn-ghost w-full">
              {t.home.allProjects} <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ── Steps ── */}
      <section className="container-x py-16 lg:py-24" aria-labelledby="steps-title">
        <h2 id="steps-title" className="text-3xl font-extrabold sm:text-4xl">
          {t.home.stepsTitle}
        </h2>
        <ol className="mt-8 grid gap-3 md:grid-cols-3 md:gap-5">
          {t.home.steps.map((s, i) => (
            <li key={s.t} className="flex gap-4 rounded-2xl bg-white p-5 md:flex-col md:p-7">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand font-display text-lg font-extrabold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold">{s.t}</h3>
                <p className="mt-1 leading-relaxed text-stone">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <CtaBanner locale={lang} settings={settings} />
    </>
  );
}
