import type { Metadata } from "next";
import type { Locale, Settings } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import { buildMetadata, samePaths } from "@/lib/seo";
import { getSettings } from "@/lib/store";
import { PageHero } from "@/components/site/PageHero";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    title: t.privacy.metaTitle,
    description: t.privacy.metaDescription,
    paths: samePaths((l) => pagePath(l, "privacy")),
  });
}

function contactLine(s: Settings) {
  return [s.companyName, [s.street, [s.postalCode, s.city].filter(Boolean).join(" ")].filter(Boolean).join(", "), s.email, s.phone, s.kvk && `KvK ${s.kvk}`]
    .filter(Boolean)
    .join(" · ");
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang);
  const s = await getSettings();
  const updated = new Date(s.updatedAt).toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", { dateStyle: "long" });

  return (
    <>
      <PageHero
        title={t.privacy.title}
        crumbs={[
          { name: t.breadcrumbs.home, path: pagePath(lang, "home") },
          { name: t.privacy.title, path: pagePath(lang, "privacy") },
        ]}
      />
      <article className="container-x py-16 lg:py-20">
        <div className="prose-ob max-w-3xl">
          {lang === "nl" ? (
            <>
              <p>
                {s.companyName} respecteert uw privacy en gaat zorgvuldig om met uw persoonsgegevens, in overeenstemming met de
                Algemene Verordening Gegevensbescherming (AVG).
              </p>
              <h2>Wie zijn wij?</h2>
              <p>{contactLine(s)}</p>
              <h2>Welke gegevens verwerken wij?</h2>
              <p>
                Wanneer u contact met ons opneemt via WhatsApp, telefoon of e-mail, verwerken wij de gegevens die u zelf
                verstrekt: naam, telefoonnummer, e-mailadres, adres, foto's van de ruimte en de inhoud van uw bericht. Deze website
                zelf verzamelt geen persoonsgegevens via formulieren.
              </p>
              <h2>Waarvoor gebruiken wij uw gegevens?</h2>
              <ul>
                <li>Om uw vraag of offerteaanvraag te beantwoorden;</li>
                <li>Om contact met u op te nemen over uw project;</li>
                <li>Om een overeenkomst met u uit te voeren en te factureren.</li>
              </ul>
              <p>De grondslag hiervoor is uw toestemming, het uitvoeren van een (toekomstige) overeenkomst, of een wettelijke verplichting.</p>
              <h2>Hoe lang bewaren wij uw gegevens?</h2>
              <p>
                Aanvragen die niet tot een opdracht leiden, bewaren wij maximaal 12 maanden. Gegevens die nodig zijn voor onze
                administratie bewaren wij zolang de wet dat voorschrijft (in de regel 7 jaar).
              </p>
              <h2>Delen met derden</h2>
              <p>
                Wij verkopen uw gegevens nooit. Wij delen gegevens alleen met partijen die nodig zijn voor onze dienstverlening
                (zoals onze hostingpartij) of wanneer de wet dat verplicht.
              </p>
              <h2>Cookies</h2>
              <p>
                Deze website plaatst geen tracking- of advertentiecookies. Er wordt alleen een functionele cookie gebruikt voor het
                beheergedeelte. Als u op een WhatsApp-knop klikt, gaat u naar WhatsApp (Meta); daarop is het privacybeleid van
                WhatsApp van toepassing.
              </p>
              <h2>Uw rechten</h2>
              <p>
                U heeft het recht om uw gegevens in te zien, te laten corrigeren of verwijderen, en om bezwaar te maken tegen de
                verwerking. Neem hiervoor contact met ons op{s.email ? ` via ${s.email}` : ""}. U heeft ook het recht een klacht
                in te dienen bij de Autoriteit Persoonsgegevens.
              </p>
              <h2>Beveiliging</h2>
              <p>Wij nemen passende maatregelen om uw gegevens te beschermen, waaronder een versleutelde (HTTPS) verbinding.</p>
              <p className="text-sm text-stone">Laatst bijgewerkt: {updated}</p>
            </>
          ) : (
            <>
              <p>
                {s.companyName} respects your privacy and handles your personal data with care, in accordance with the General Data
                Protection Regulation (GDPR).
              </p>
              <h2>Who are we?</h2>
              <p>{contactLine(s)}</p>
              <h2>What data do we process?</h2>
              <p>
                When you contact us via WhatsApp, phone or email, we process the data you provide: name, phone number, email
                address, address, photos of the space and the content of your message. This website itself does not collect
                personal data through forms.
              </p>
              <h2>What do we use your data for?</h2>
              <ul>
                <li>To answer your question or quote request;</li>
                <li>To contact you about your project;</li>
                <li>To perform an agreement with you and invoice.</li>
              </ul>
              <p>The legal basis is your consent, the performance of a (future) contract, or a legal obligation.</p>
              <h2>How long do we keep your data?</h2>
              <p>
                Requests that do not lead to an assignment are kept for a maximum of 12 months. Data required for our accounts is
                kept as long as the law requires (usually 7 years).
              </p>
              <h2>Sharing with third parties</h2>
              <p>
                We never sell your data. We only share data with parties needed for our services (such as our hosting provider) or
                when required by law.
              </p>
              <h2>Cookies</h2>
              <p>
                This website does not place tracking or advertising cookies. Only a functional cookie is used for the admin area.
                If you click a WhatsApp button you are taken to WhatsApp (Meta), whose privacy policy applies.
              </p>
              <h2>Your rights</h2>
              <p>
                You have the right to access, correct or delete your data and to object to processing. Please contact us
                {s.email ? ` at ${s.email}` : ""}. You also have the right to lodge a complaint with the Dutch Data Protection
                Authority (Autoriteit Persoonsgegevens).
              </p>
              <h2>Security</h2>
              <p>We take appropriate measures to protect your data, including an encrypted (HTTPS) connection.</p>
              <p className="text-sm text-stone">Last updated: {updated}</p>
            </>
          )}
        </div>
      </article>
    </>
  );
}
