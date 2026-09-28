import type { Metadata } from "next";
import type { Locale, Settings } from "./types";
import { absoluteUrl, brand, intlPhone, siteUrl } from "./site";
import { VIDEO_EXT } from "./media";
import { getDictionary } from "./i18n";
import { pagePath } from "./routes";
import { services } from "./services";

type BuildArgs = {
  locale: Locale;
  title: string;
  description: string;
  /** Path of this page per locale, e.g. { nl: "/nl/diensten", en: "/en/services" } */
  paths: Record<Locale, string>;
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  type?: "website" | "article";
  noindex?: boolean;
  absoluteTitle?: boolean;
};

export function buildMetadata({ locale, title, description, paths, images, type = "website", noindex, absoluteTitle }: BuildArgs): Metadata {
  const dict = getDictionary(locale);
  const canonical = paths[locale];
  const stills = images?.filter((i) => !VIDEO_EXT.test(i.url));
  const ogImages = stills?.length
    ? stills
    : [{ url: `/api/og?title=${encodeURIComponent(title.replace(/^Oynur Bouw B\.V\. \| /, ""))}&eyebrow=${encodeURIComponent(brand.name)}`, width: 1200, height: 630, alt: title }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: { nl: paths.nl, en: paths.en, "x-default": paths.nl },
    },
    openGraph: {
      type,
      url: canonical,
      title,
      description,
      siteName: brand.name,
      locale: dict.ogLocale,
      alternateLocale: locale === "nl" ? ["en_US"] : ["nl_NL"],
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function samePaths(fn: (l: Locale) => string): Record<Locale, string> {
  return { nl: fn("nl"), en: fn("en") };
}

export function socialUrls(settings: Settings) {
  return Object.values(settings.socials).filter((u) => /^https?:\/\//.test(u));
}

/** schema.org GeneralContractor (LocalBusiness) — the main signal for Google's local results. */
export function organizationJsonLd(settings: Settings, locale: Locale) {
  const hasAddress = settings.street || settings.city;
  const phone = settings.phone ? intlPhone(settings.phone) : undefined;
  const area = settings.serviceArea[locale] || settings.city || "Nederland";
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${siteUrl}/#organization`,
    name: settings.companyName || brand.name,
    alternateName: brand.shortName,
    legalName: settings.companyName || brand.name,
    url: absoluteUrl(`/${locale}`),
    logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo.png"), width: 1200, height: 239 },
    image: [settings.heroImage, settings.aboutImage]
      .filter((i) => i && !VIDEO_EXT.test(i.src))
      .map((i) => absoluteUrl(i!.src))
      .concat(absoluteUrl("/brand/icon-512.png")),
    description: settings.tagline[locale],
    ...(phone ? { telephone: phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(hasAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: settings.street || undefined,
            postalCode: settings.postalCode || undefined,
            addressLocality: settings.city || undefined,
            addressCountry: settings.country || "NL",
          },
          hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            [settings.companyName, settings.street, settings.postalCode, settings.city].filter(Boolean).join(", "),
          )}`,
        }
      : {}),
    areaServed: area.split(/,| en | and /).map((a) => ({ "@type": "Place", name: a.trim() })).filter((a) => a.name),
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        ...(phone ? { telephone: phone } : {}),
        ...(settings.email ? { email: settings.email } : {}),
        availableLanguage: ["Dutch", "English"],
        areaServed: "NL",
      },
    ],
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Bank transfer",
    ...(settings.kvk ? { identifier: { "@type": "PropertyValue", propertyID: "KvK", value: settings.kvk } } : {}),
    ...(settings.btw ? { vatID: settings.btw } : {}),
    sameAs: socialUrls(settings),
    knowsAbout: services.map((s) => s.title[locale]),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: getDictionary(locale).services.title,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title[locale], url: absoluteUrl(`${pagePath(locale, "services")}/${s.slug[locale]}`) },
      })),
    },
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: absoluteUrl(`/${locale}`),
    name: brand.name,
    inLanguage: locale === "nl" ? "nl-NL" : "en",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
