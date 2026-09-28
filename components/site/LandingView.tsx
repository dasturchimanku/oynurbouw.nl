import type { Metadata } from "next";
import { Media } from "@/components/Media";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, Check, ChevronDown } from "lucide-react";
import type { Landing, LandingKey, Locale } from "@/lib/types";
import { landingKeys } from "@/lib/types";
import { getDictionary, withCity } from "@/lib/i18n";
import { getLanding, getPublishedProjects, getSettings } from "@/lib/store";
import { landingMeta, landingPath } from "@/lib/landings";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { pagePath } from "@/lib/routes";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { waLink } from "@/lib/contact";
import { mediaTypeOf } from "@/lib/media";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PriceCalculator, type CalcLabels } from "@/components/site/PriceCalculator";
import { ProjectGrid } from "@/components/site/ProjectGrid";
import { CtaBanner } from "@/components/site/CtaBanner";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { SocialIcon } from "@/components/SocialIcon";
import { JsonLd } from "@/components/JsonLd";


const copy = {
  nl: {
    prices: "Prijzen",
    pricesTitle: "Heldere prijzen",
    from: "vanaf",
    onRequest: "Op aanvraag",
    seePrices: "Bekijk prijzen",
    portfolio: "Ons werk",
    portfolioText: "Echte projecten, echte foto's.",
    faq: "Veelgestelde vragen",
    calc: {
      title: "Bereken uw prijs",
      choose: "Wat wilt u laten doen?",
      amount: "Hoeveel",
      estimate: "Indicatie",
      from: "vanaf",
      disclaimer: "Dit is een indicatie. Na het zien van foto's ontvangt u een vaste prijs.",
      send: "Vraag deze prijs aan",
      message: "Hallo Oynur Bouw, ik wil graag een offerte voor {service}: {item}, ca. {amount} {unit} (indicatie {total}). Ik stuur foto's mee.",
    } satisfies CalcLabels,
  },
  en: {
    prices: "Prices",
    pricesTitle: "Clear prices",
    from: "from",
    onRequest: "On request",
    seePrices: "See prices",
    portfolio: "Our work",
    portfolioText: "Real projects, real photos.",
    faq: "Frequently asked questions",
    calc: {
      title: "Calculate your price",
      choose: "What do you need?",
      amount: "How much",
      estimate: "Estimate",
      from: "from",
      disclaimer: "This is an estimate. After seeing photos you'll receive a fixed price.",
      send: "Request this price",
      message: "Hello Oynur Bouw, I'd like a quote for {service}: {item}, approx. {amount} {unit} (estimate {total}). I'll send photos.",
    } satisfies CalcLabels,
  },
};

async function load(key: LandingKey) {
  const landing = await getLanding(key);
  return landing.published ? landing : null;
}

/** A still image for Google/social previews (poster frame if the hero is a video). */
function heroStill(l: Landing) {
  const h = l.heroImage;
  if (!h) return null;
  if (mediaTypeOf(h) === "video") return h.poster ? { url: h.poster, width: h.width, height: h.height, alt: h.alt.nl } : null;
  return { url: h.src, width: h.width, height: h.height, alt: h.alt.nl };
}

function lowestPrice(l: Landing) {
  const ps = l.prices.filter((p) => p.price > 0).sort((a, b) => a.price - b.price);
  return ps[0] || null;
}

export async function landingMetadata(lang: Locale, key: LandingKey): Promise<Metadata> {
  const l = await load(key);
  if (!l) return {};
  const s = await getSettings();
  return buildMetadata({
    locale: lang,
    title: withCity(l.seoTitle[lang] || l.seoTitle.nl, s.city, lang),
    description: withCity(l.seoDescription[lang] || l.seoDescription.nl, s.city, lang).slice(0, 170),
    paths: { nl: landingPath("nl", l.key), en: landingPath("en", l.key) },
    ...(heroStill(l) ? { images: [heroStill(l)!] } : {}),
  });
}

export async function LandingView({ lang, landingKey }: { lang: Locale; landingKey: LandingKey }) {
  const l = await load(landingKey);
  if (!l) notFound();
  const t = getDictionary(lang);
  const c = copy[lang];
  const tx = (v: { nl: string; en: string }) => v[lang] || v.nl;
  const [settings, projects] = await Promise.all([getSettings(), getPublishedProjects()]);
  const meta = landingMeta[l.key];
  const label = meta.label[lang];
  const portfolio = projects.filter((p) => p.category === meta.serviceKey);
  const cheapest = lowestPrice(l);
  const fmt = new Intl.NumberFormat(lang === "nl" ? "nl-NL" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const wa = waLink(settings, lang, { about: label });

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: label,
    serviceType: label,
    description: withCity(tx(l.seoDescription), settings.city, lang),
    url: absoluteUrl(landingPath(lang, l.key)),
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: settings.serviceArea[lang] || settings.city || "Nederland",
    ...(heroStill(l) ? { image: absoluteUrl(heroStill(l)!.url) } : {}),
    offers: l.prices
      .filter((p) => p.price > 0)
      .map((p) => ({
        "@type": "Offer",
        name: tx(p.name),
        priceCurrency: "EUR",
        price: p.price,
        priceSpecification: { "@type": "UnitPriceSpecification", price: p.price, priceCurrency: "EUR", unitText: tx(p.unit), valueAddedTaxIncluded: true },
      })),
  };
  const faqs = l.faqs.map((f) => ({ q: tx(f.q), a: tx(f.a) })).filter((f) => f.q && f.a);

  return (
    <>
      <JsonLd data={serviceLd} />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      {/* ── Hero ── */}
      <section className="pt-20 lg:pt-28">
        <div className="container-x grid grid-cols-1 items-center gap-8 py-4 lg:grid-cols-2 lg:gap-16 lg:py-12">
          <div className="animate-fade-up">
            <div className="hidden lg:block">
              <Breadcrumbs
                items={[
                  { name: t.breadcrumbs.home, path: pagePath(lang, "home") },
                  { name: label, path: landingPath(lang, l.key) },
                ]}
              />
            </div>
            <p className="eyebrow lg:mt-8">{withCity(tx(l.eyebrow), settings.city, lang)}</p>
            <h1 className="mt-4 text-[2.5rem] leading-[1.04] font-extrabold sm:text-6xl">
              {tx(l.title)} <span className="text-brand">{tx(l.titleAccent)}</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-stone sm:text-lg">{tx(l.text)}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn h-14 bg-[#25D366] !px-7 text-base text-white hover:bg-[#1ebe5b]">
                <SocialIcon name="whatsapp" className="size-5" /> {t.wa.button}
              </a>
              <a href="#prijzen" className="btn-ghost h-14 !px-7 text-base">
                {c.seePrices} <ArrowDown className="size-4" />
              </a>
            </div>
            <ul className="mt-7 flex flex-col gap-2 text-[15px] text-ink-700 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {l.usps.map((u) => (
                <li key={u.nl} className="flex items-center gap-2">
                  <Check className="size-4 text-brand" strokeWidth={3} /> {tx(u)}
                </li>
              ))}
            </ul>
          </div>

          {l.heroImage && (
            <div className="relative animate-fade-up [animation-delay:120ms]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand lg:aspect-[4/5]">
                <Media
                  item={l.heroImage}
                  alt={tx(l.heroImage.alt) || label}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              {cheapest && (
                <a
                  href="#prijzen"
                  className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white py-3 pr-5 pl-3 shadow-lift sm:left-6"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-brand text-white">
                    <ServiceIcon name={meta.icon} className="size-5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-xs text-stone">{tx(cheapest.name)}</span>
                    <span className="block font-display text-lg font-extrabold">
                      {c.from} {fmt.format(cheapest.price)} <span className="text-sm font-semibold text-stone">{tx(cheapest.unit)}</span>
                    </span>
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Services ── */}
      <section className="container-x pt-16 pb-12 lg:pt-24" aria-labelledby="svc-title">
        <h2 id="svc-title" className="text-3xl font-extrabold sm:text-4xl">
          {tx(l.servicesTitle)}
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {l.services.map((s, i) => (
            <li key={s.title.nl + i} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
              <span className="font-display text-sm font-extrabold text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-bold">{tx(s.title)}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-stone">{tx(s.text)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Prices + calculator ── */}
      <section id="prijzen" className="scroll-mt-20 bg-white py-16 lg:py-24" aria-labelledby="price-title">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="eyebrow">{c.prices}</p>
            <h2 id="price-title" className="mt-3 text-3xl font-extrabold sm:text-4xl">
              {c.pricesTitle}
            </h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {l.prices.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <h3 className="font-bold">{tx(p.name)}</h3>
                    {tx(p.note) && <p className="text-sm text-stone">{tx(p.note)}</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    {p.price > 0 ? (
                      <>
                        <span className="block text-xs text-stone">{c.from}</span>
                        <span className="font-display text-xl font-extrabold tabular-nums">{fmt.format(p.price)}</span>
                        <span className="block text-xs text-stone">{tx(p.unit)}</span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-ink-700">{c.onRequest}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {tx(l.priceNote) && <p className="mt-4 text-sm text-stone">{tx(l.priceNote)}</p>}
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <PriceCalculator
              items={l.prices.filter((p) => p.calc && p.price > 0).map((p) => ({ id: p.id, name: tx(p.name), price: p.price, unit: tx(p.unit) }))}
              whatsapp={settings.whatsapp || settings.phone}
              service={label}
              labels={c.calc}
              locale={lang}
            />
          </div>
        </div>
      </section>

      {/* ── Team at work ── */}
      {l.teamImages.length > 0 && (
        <section className="py-16 lg:py-24" aria-labelledby="team-title">
          <div className="container-x">
            <h2 id="team-title" className="text-3xl font-extrabold sm:text-4xl">
              {tx(l.teamTitle)}
            </h2>
            {tx(l.teamText) && <p className="mt-2 max-w-2xl text-stone">{tx(l.teamText)}</p>}
          </div>
          <ul
            className={`mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:gap-5 lg:overflow-visible lg:px-8 ${
              l.teamImages.length === 1 ? "lg:grid-cols-1" : l.teamImages.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"
            }`}
          >
            {l.teamImages.map((im, i) => (
              <li key={im.src + i} className={`shrink-0 snap-start lg:w-auto ${l.teamImages.length === 1 ? "w-full" : "w-[85%] sm:w-[60%]"}`}>
                <div className={`relative overflow-hidden rounded-[1.5rem] bg-sand ${l.teamImages.length === 1 ? "aspect-square sm:aspect-[16/9]" : "aspect-square"}`}>
                  <Media item={im} alt={tx(im.alt) || tx(l.teamTitle)} fill sizes="(min-width: 1024px) 50vw, 85vw" className="object-cover" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Portfolio ── */}
      {portfolio.length > 0 && (
        <section className="mx-auto max-w-5xl pb-16 sm:px-6 lg:px-8 lg:pb-24" aria-labelledby="work-title">
          <div className="mb-5 px-4 sm:px-0">
            <h2 id="work-title" className="text-3xl font-extrabold sm:text-4xl">
              {c.portfolio}
            </h2>
            <p className="mt-2 text-stone">{c.portfolioText}</p>
          </div>
          <ProjectGrid projects={portfolio} locale={lang} />
        </section>
      )}

      {/* ── Steps ── */}
      <section className="container-x pb-16 lg:pb-24" aria-labelledby="steps-title">
        <h2 id="steps-title" className="text-3xl font-extrabold sm:text-4xl">
          {t.home.stepsTitle}
        </h2>
        <ol className="mt-8 grid gap-3 md:grid-cols-3 md:gap-5">
          {t.home.steps.map((s, i) => (
            <li key={s.t} className="flex gap-4 rounded-2xl bg-white p-5 md:flex-col md:p-7">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand font-display text-lg font-extrabold text-white">{i + 1}</span>
              <div>
                <h3 className="text-lg font-bold">{s.t}</h3>
                <p className="mt-1 leading-relaxed text-stone">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── FAQ ── */}
      {faqs.length > 0 && (
        <section className="container-x max-w-3xl" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-3xl font-extrabold sm:text-4xl">
            {c.faq}
          </h2>
          <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  <h3>{f.q}</h3>
                  <ChevronDown className="size-5 shrink-0 text-brand transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed text-stone">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <CtaBanner
        locale={lang}
        settings={settings}
        about={label}
        title={t.services.ctaTitle.replace("{topic}", label.toLowerCase())}
        text={t.services.ctaText}
      />

      <nav className="container-x -mt-8 pb-12 text-center text-sm text-stone" aria-label="Related">
        {landingKeys
          .filter((k) => k !== l.key)
          .map((k) => (
            <Link key={k} href={landingPath(lang, k)} className="font-semibold text-brand hover:underline">
              {landingMeta[k].label[lang]} →
            </Link>
          ))}
      </nav>
    </>
  );
}
