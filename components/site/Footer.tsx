import Link from "next/link";
import Image from "next/image";
import type { Locale, Settings } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { pagePath, servicePath } from "@/lib/routes";
import { services } from "@/lib/services";
import { telHref } from "@/lib/site";
import { SocialLinks } from "./SocialLinks";

export function Footer({ locale, settings }: { locale: Locale; settings: Settings }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();
  const name = (settings.companyName || "Oynur Bouw B.V.").replace(/\.$/, "");
  const address = [settings.street, [settings.postalCode, settings.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");

  return (
    <footer className="border-t border-line bg-white pb-24 lg:pb-0">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-12 lg:grid-cols-12 lg:py-16">
        <div className="col-span-2 lg:col-span-4">
          <Link href={`/${locale}`} aria-label="Oynur Bouw B.V.">
            <Image src="/brand/logo.png" alt="Oynur Bouw B.V." width={220} height={44} className="h-8 w-auto" />
          </Link>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-stone">{settings.tagline[locale] || t.footer.about}</p>
          <div className="mt-6">
            <SocialLinks settings={settings} />
          </div>
        </div>

        <nav aria-label={t.footer.services} className="lg:col-span-3">
          <h2 className="text-sm font-semibold text-ink">{t.footer.services}</h2>
          <ul className="mt-4 space-y-2.5 text-[15px] text-stone">
            {services.map((s) => (
              <li key={s.key}>
                <Link href={servicePath(locale, s.key)} className="hover:text-brand">
                  {s.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t.footer.navigation} className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink">{t.footer.navigation}</h2>
          <ul className="mt-4 space-y-2.5 text-[15px] text-stone">
            {(["projects", "about", "contact", "privacy"] as const).map((k) => (
              <li key={k}>
                <Link href={pagePath(locale, k)} className="hover:text-brand">
                  {k === "privacy" ? t.privacy.title : t.nav[k]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 lg:col-span-3">
          <h2 className="text-sm font-semibold text-ink">{t.footer.contact}</h2>
          <ul className="mt-4 space-y-2.5 text-[15px] text-stone">
            {settings.phone && (
              <li>
                <a href={telHref(settings.phone)} className="hover:text-brand">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-brand">
                  {settings.email}
                </a>
              </li>
            )}
            {address && <li>{address}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-1.5 py-6 text-xs text-stone sm:flex-row sm:justify-between">
          <p>
            © {year} {name}. {t.footer.rights}
          </p>
          <p className="flex flex-wrap gap-x-3">
            {settings.kvk && <span>{t.footer.kvk} {settings.kvk}</span>}
            {settings.btw && <span>{t.footer.btw} {settings.btw}</span>}
          </p>
        </div>
      </div>
    </footer>
  );
}
