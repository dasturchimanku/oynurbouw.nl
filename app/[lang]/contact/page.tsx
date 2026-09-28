import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import { buildMetadata, samePaths } from "@/lib/seo";
import { getSettings } from "@/lib/store";
import { telHref } from "@/lib/site";
import { waLink } from "@/lib/contact";
import { PageHero } from "@/components/site/PageHero";
import { SocialLinks } from "@/components/site/SocialLinks";
import { SocialIcon } from "@/components/SocialIcon";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    title: t.contact.metaTitle,
    description: t.contact.metaDescription,
    paths: samePaths((l) => pagePath(l, "contact")),
  });
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang);
  const s = await getSettings();
  const address = [s.street, [s.postalCode, s.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const row = "flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-brand/40";
  const icon = "grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand";

  return (
    <>
      <PageHero
        title={t.contact.title}
        text={t.contact.text}
        crumbs={[
          { name: t.breadcrumbs.home, path: pagePath(lang, "home") },
          { name: t.nav.contact, path: pagePath(lang, "contact") },
        ]}
      />
      <section className="container-x grid grid-cols-1 gap-10 pb-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
        <div className="space-y-3">
          <a
            href={waLink(s, lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 rounded-[1.5rem] bg-[#25D366] p-6 text-white transition hover:bg-[#1ebe5b] sm:p-8"
          >
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/20">
              <SocialIcon name="whatsapp" className="size-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xl font-bold sm:text-2xl">{t.contact.waTitle}</span>
              <span className="block text-white/85">{t.contact.waText}</span>
            </span>
            <ArrowUpRight className="size-6 shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          {s.phone && (
            <a href={telHref(s.phone)} className={row}>
              <span className={icon}>
                <Phone className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-stone">{t.contact.phone}</span>
                <span className="block font-semibold">{s.phone}</span>
              </span>
            </a>
          )}
          {s.email && (
            <a href={`mailto:${s.email}`} className={row}>
              <span className={icon}>
                <Mail className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-stone">{t.contact.email}</span>
                <span className="block truncate font-semibold">{s.email}</span>
              </span>
            </a>
          )}
          {address && (
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.companyName}, ${address}`)}`} target="_blank" rel="noopener noreferrer" className={row}>
              <span className={icon}>
                <MapPin className="size-5" />
              </span>
              <address className="font-semibold not-italic">{address}</address>
            </a>
          )}
        </div>

        <aside className="space-y-8">
          {s.openingHours[lang] && (
            <div>
              <h2 className="flex items-center gap-2 font-bold">
                <Clock className="size-4 text-brand" /> {t.contact.hours}
              </h2>
              <p className="mt-2 whitespace-pre-line text-stone">{s.openingHours[lang]}</p>
            </div>
          )}
          {s.serviceArea[lang] && (
            <div>
              <h2 className="flex items-center gap-2 font-bold">
                <MapPin className="size-4 text-brand" /> {t.contact.area}
              </h2>
              <p className="mt-2 text-stone">{s.serviceArea[lang]}</p>
            </div>
          )}
          <div>
            <h2 className="font-bold">{t.contact.follow}</h2>
            <div className="mt-3">
              <SocialLinks settings={s} size="lg" />
            </div>
          </div>
          <div>
            <h2 className="font-bold">{t.contact.company}</h2>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[15px] text-stone">
              <dt>{lang === "nl" ? "Naam" : "Name"}</dt>
              <dd className="text-ink">{s.companyName}</dd>
              {s.kvk && (
                <>
                  <dt>{t.footer.kvk}</dt>
                  <dd className="text-ink">{s.kvk}</dd>
                </>
              )}
              {s.btw && (
                <>
                  <dt>{t.footer.btw}</dt>
                  <dd className="text-ink">{s.btw}</dd>
                </>
              )}
              {s.iban && (
                <>
                  <dt>{t.contact.iban}</dt>
                  <dd className="text-ink">{s.iban}</dd>
                </>
              )}
            </dl>
          </div>
        </aside>
      </section>
    </>
  );
}
