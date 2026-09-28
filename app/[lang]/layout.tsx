import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/inter";
import "@fontsource-variable/archivo/wdth.css";
import "../globals.css";
import { isLocale, getDictionary, withCity } from "@/lib/i18n";
import { landingKeys, locales } from "@/lib/types";
import { landingMeta, landingPath } from "@/lib/landings";
import { getSettings } from "@/lib/store";
import { siteUrl, brand } from "@/lib/site";
import { pagePath } from "@/lib/routes";
import { services } from "@/lib/services";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ActionBar } from "@/components/site/ActionBar";
import { waLink, phoneLink } from "@/lib/contact";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";


export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${brand.shortName} | ${withCity(t.home.metaTitle, settings.city, lang)}`, template: `%s | ${brand.shortName}` },
    description: withCity(t.home.metaDescription, settings.city, lang),
    applicationName: brand.name,
    authors: [{ name: brand.name }],
    creator: brand.name,
    publisher: brand.name,
    category: "construction",
    formatDetection: { telephone: false, email: false, address: false },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const settings = await getSettings();

  const nav = [
    ...landingKeys.map((k) => ({ href: landingPath(lang, k), label: landingMeta[k].label[lang] })),
    ...(["services", "projects", "about", "contact"] as const).map((k) => ({ href: pagePath(lang, k), label: t.nav[k] })),
  ];
  const slugPairs: [string, string][] = [
    ["diensten", "services"],
    ["projecten", "projects"],
    ["over-ons", "about"],
    ...landingKeys.map((k) => [landingMeta[k].slug.nl, landingMeta[k].slug.en] as [string, string]),
    ...services.map((s) => [s.slug.nl, s.slug.en] as [string, string]),
  ];

  return (
    <html lang={lang === "nl" ? "nl-NL" : "en"}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          {t.nav.skip}
        </a>
        <Header
          locale={lang}
          nav={nav}
          labels={{ menu: t.nav.menu, close: t.nav.close, whatsapp: t.wa.button, call: t.wa.call }}
          phone={settings.phone}
          phoneHref={phoneLink(settings)}
          whatsappHref={waLink(settings, lang)}
          slugPairs={slugPairs}
        />
        <main id="main">{children}</main>
        <Footer locale={lang} settings={settings} />
        <ActionBar whatsappHref={waLink(settings, lang)} phoneHref={phoneLink(settings)} labels={{ whatsapp: t.wa.button, call: t.wa.call }} />
        <JsonLd data={organizationJsonLd(settings, lang)} />
        <JsonLd data={websiteJsonLd(lang)} />
      </body>
    </html>
  );
}
