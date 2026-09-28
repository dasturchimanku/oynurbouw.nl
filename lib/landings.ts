import type { Landing, LandingKey, Locale, Localized, ProjectImage } from "./types";

/** Route + service mapping for the landing pages. */
export const landingMeta: Record<LandingKey, { serviceKey: string; slug: Localized; label: Localized; icon: "plaster" | "paint" }> = {
  stucwerk: {
    serviceKey: "plastering",
    slug: { nl: "stucwerk", en: "plastering" },
    label: { nl: "Stucwerk", en: "Plastering" },
    icon: "plaster",
  },
  schilderwerk: {
    serviceKey: "painting",
    slug: { nl: "schilderwerk", en: "painting" },
    label: { nl: "Schilderwerk", en: "Painting" },
    icon: "paint",
  },
};

export function landingPath(locale: Locale, key: LandingKey) {
  return `/${locale}/${landingMeta[key].slug[locale]}`;
}

export function landingBySlug(locale: Locale, slug: string): LandingKey | null {
  const hit = (Object.keys(landingMeta) as LandingKey[]).find(
    (k) => landingMeta[k].slug[locale] === slug || landingMeta[k].slug.nl === slug || landingMeta[k].slug.en === slug,
  );
  return hit || null;
}

/** Service key → landing key (the landing page replaces that service page). */
export function landingForService(serviceKey: string): LandingKey | null {
  return (Object.keys(landingMeta) as LandingKey[]).find((k) => landingMeta[k].serviceKey === serviceKey) || null;
}

const L = (nl: string, en: string): Localized => ({ nl, en });
const img = (src: string, w: number, h: number, alt: Localized): ProjectImage => ({
  id: src.replace(/\W/g, ""),
  src,
  width: w,
  height: h,
  alt,
  kind: "gallery",
});

const stucVideo: ProjectImage = {
  ...img("/media/landing-stuc-video.mp4", 720, 1278, L("Stukadoor van Oynur Bouw zet een wand strak af", "Oynur Bouw plasterer finishing a wall")),
  media: "video",
  poster: "/media/landing-stuc-video-poster.webp",
  webm: "/media/landing-stuc-video.webm",
};
const paintVideo: ProjectImage = {
  ...img("/media/landing-schilder-video.mp4", 720, 1278, L("Schilder van Oynur Bouw rolt een wand in één strakke kleur", "Oynur Bouw painter rolling a wall")),
  media: "video",
  poster: "/media/landing-schilder-video-poster.webp",
  webm: "/media/landing-schilder-video.webm",
};
const stucTeam = img("/media/landing-stuc-team.webp", 1254, 1254, L("Stukadoors van Oynur Bouw zetten een wand glad af", "Oynur Bouw plasterers finishing a wall smoothly"));
const paintTeam = img("/media/landing-schilder-team.webp", 1254, 1254, L("Schilders van Oynur Bouw rollen een wand in één strakke kleur", "Oynur Bouw painters rolling a wall in one even colour"));
const paintFrames = img("/media/landing-schilder-kozijnen.webp", 1024, 1024, L("Schilder van Oynur Bouw lakt binnenkozijnen", "Oynur Bouw painter lacquering interior window frames"));

export function defaultLandings(): Record<LandingKey, Landing> {
  const now = new Date().toISOString();
  return {
    stucwerk: {
      key: "stucwerk",
      published: true,
      eyebrow: L("Stukadoor{in}", "Plasterer{in}"),
      title: L("Strak stucwerk,", "Smooth plastering,"),
      titleAccent: L("zonder gedoe.", "without the hassle."),
      text: L(
        "Van glad pleisterwerk tot spackspuiten: wij maken uw wanden en plafonds strak en klaar om te schilderen. Netjes afgedekt, stofarm gewerkt en snel klaar.",
        "From smooth plaster to spray finishes: we make your walls and ceilings perfectly smooth and ready to paint. Everything covered, low-dust and finished fast.",
      ),
      heroImage: stucVideo,
      usps: [L("Vrijblijvende prijsopgave", "Free quote"), L("Alles netjes afgedekt", "Everything neatly covered"), L("Direct schilderklaar", "Ready to paint")],
      servicesTitle: L("Wat wij stucen", "What we plaster"),
      services: [
        { title: L("Wanden glad stucen", "Smooth wall plastering"), text: L("Oude of nieuwe wanden strak en egaal, klaar voor verf of behang.", "Old or new walls smooth and even, ready for paint or wallpaper.") },
        { title: L("Plafonds stucen", "Ceiling plastering"), text: L("Scheuren en oneffenheden weg: een strak, egaal plafond.", "No more cracks or bumps: a smooth, even ceiling.") },
        { title: L("Spackspuiten", "Spray finish (spack)"), text: L("Snelle, strakke spuitafwerking voor plafonds en wanden.", "Fast, clean spray finish for ceilings and walls.") },
        { title: L("Sierpleister & structuur", "Decorative plaster"), text: L("Beton-look, kalkstuc of een fijne structuur voor karakter.", "Concrete look, lime plaster or a fine texture for character.") },
        { title: L("Reparatie & herstel", "Repairs"), text: L("Scheuren, gaten en beschadigde hoeken onzichtbaar hersteld.", "Cracks, holes and damaged corners invisibly repaired.") },
        { title: L("Gipsplaten & voorzetwanden", "Plasterboard walls"), text: L("Nieuwe wanden en plafonds plaatsen, naadloos afgewerkt.", "New walls and ceilings installed and seamlessly finished.") },
      ],
      prices: [
        { id: "s1", name: L("Wanden glad stucen", "Smooth wall plastering"), price: 16, unit: L("per m²", "per m²"), calc: true, note: L("Inclusief voorbehandeling en hoekprofielen", "Including primer and corner beads") },
        { id: "s2", name: L("Plafond glad stucen", "Smooth ceiling plastering"), price: 19, unit: L("per m²", "per m²"), calc: true, note: L("Inclusief afdekken van vloer en meubels", "Including covering floors and furniture") },
        { id: "s3", name: L("Spackspuiten", "Spray finish"), price: 9, unit: L("per m²", "per m²"), calc: true, note: L("Plafonds en wanden, wit afgewerkt", "Ceilings and walls, finished in white") },
        { id: "s4", name: L("Sierpleister / beton-look", "Decorative plaster"), price: 35, unit: L("per m²", "per m²"), calc: true, note: L("Afhankelijk van de gekozen afwerking", "Depending on the chosen finish") },
        { id: "s5", name: L("Kleine reparaties", "Small repairs"), price: 45, unit: L("per uur", "per hour"), calc: false, note: L("Scheuren, gaten, hoeken", "Cracks, holes, corners") },
      ],
      priceNote: L(
        "Vanaf-prijzen incl. btw, exclusief eventueel sloopwerk. U ontvangt altijd eerst een vaste prijs op maat.",
        "Starting prices incl. VAT, excluding any demolition. You always receive a fixed tailored price first.",
      ),
      teamTitle: L("Onze stukadoors aan het werk", "Our plasterers at work"),
      teamText: L(
        "Ervaren vakmensen die netjes werken en uw huis opgeruimd achterlaten.",
        "Experienced craftsmen who work tidily and leave your home clean.",
      ),
      teamImages: [stucTeam],
      faqs: [
        { q: L("Hoe lang moet stucwerk drogen?", "How long does plaster take to dry?"), a: L("Reken op ongeveer 1 week per cm dikte, afhankelijk van ventilatie en temperatuur. Daarna kunt u het beste eerst een voorstrijkmiddel gebruiken voordat u schildert.", "Allow roughly 1 week per cm of thickness, depending on ventilation and temperature. Then use a primer before painting.") },
        { q: L("Moet ik de ruimte leeg maken?", "Do I need to empty the room?"), a: L("Het liefst wel, maar het hoeft niet. Wij dekken vloeren en meubels zorgvuldig af.", "Preferably, but it is not required. We carefully cover floors and furniture.") },
        { q: L("Maken jullie ook veel stof?", "Do you make a lot of dust?"), a: L("Stucen zelf geeft weinig stof. We werken netjes en ruimen dagelijks op.", "Plastering itself creates little dust. We work tidily and clean up every day.") },
        { q: L("Hoe krijg ik een prijs?", "How do I get a price?"), a: L("Stuur ons een WhatsApp met foto's en de afmetingen van de ruimte. U krijgt snel een vrijblijvende prijsopgave.", "Send us a WhatsApp with photos and the room dimensions. You'll quickly receive a free quote.") },
      ],
      seoTitle: L("Stukadoor{in} | Stucwerk vanaf €16 per m²", "Plasterer{in} | Plastering from €16 per m²"),
      seoDescription: L(
        "Stucwerk{in} door Oynur Bouw: wanden en plafonds glad stucen, spackspuiten en sierpleister. Heldere prijzen, netjes werk. Stuur een WhatsApp voor een vrijblijvende offerte.",
        "Plastering{in} by Oynur Bouw: smooth walls and ceilings, spray finishes and decorative plaster. Clear prices, tidy work. Send a WhatsApp for a free quote.",
      ),
      updatedAt: now,
    },
    schilderwerk: {
      key: "schilderwerk",
      published: true,
      eyebrow: L("Schilder{in}", "Painter{in}"),
      title: L("Schilderwerk dat", "Painting that"),
      titleAccent: L("jaren mooi blijft.", "stays beautiful for years."),
      text: L(
        "Muren, plafonds, kozijnen en deuren: wij schilderen binnen en buiten met een strakke afwerking. Goed voorbereid, netjes afgeplakt en snel opgeleverd.",
        "Walls, ceilings, frames and doors: we paint inside and out with a crisp finish. Well prepared, neatly masked and delivered fast.",
      ),
      heroImage: paintVideo,
      usps: [L("Vrijblijvende prijsopgave", "Free quote"), L("Kwaliteitsverf", "Quality paint"), L("Strakke lijnen", "Crisp lines")],
      servicesTitle: L("Wat wij schilderen", "What we paint"),
      services: [
        { title: L("Muren & plafonds", "Walls & ceilings"), text: L("Egaal in twee lagen, in elke gewenste kleur.", "Evenly in two coats, in any colour you like.") },
        { title: L("Kozijnen & ramen", "Window frames"), text: L("Schuren, gronden en lakken voor een duurzame bescherming.", "Sanding, priming and lacquering for lasting protection.") },
        { title: L("Deuren & trappen", "Doors & stairs"), text: L("Strak gelakt, ook in hoogglans of zijdeglans.", "Smoothly lacquered, also in high gloss or satin.") },
        { title: L("Buitenschilderwerk", "Exterior painting"), text: L("Houtwerk en gevels beschermd tegen weer en wind.", "Woodwork and facades protected against the weather.") },
        { title: L("Accentwanden", "Accent walls"), text: L("Grafische vormen, strepen of een donkere kleur als eyecatcher.", "Graphic shapes, stripes or a dark colour as an eye-catcher.") },
        { title: L("Houtrot herstel", "Wood rot repair"), text: L("Rot verwijderen en vakkundig herstellen vóór het schilderen.", "Removing rot and repairing properly before painting.") },
      ],
      prices: [
        { id: "p1", name: L("Muren schilderen (2 lagen)", "Walls, 2 coats"), price: 11, unit: L("per m²", "per m²"), calc: true, note: L("Inclusief afplakken en afdekken", "Including masking and covering") },
        { id: "p2", name: L("Plafond schilderen (2 lagen)", "Ceiling, 2 coats"), price: 13, unit: L("per m²", "per m²"), calc: true, note: L("Wit of kleur naar keuze", "White or colour of choice") },
        { id: "p3", name: L("Binnenkozijn lakken", "Interior frame"), price: 95, unit: L("per kozijn", "per frame"), calc: true, note: L("Schuren, gronden en aflakken", "Sanding, priming and top coat") },
        { id: "p4", name: L("Binnendeur lakken", "Interior door"), price: 85, unit: L("per deur", "per door"), calc: true, note: L("Beide zijden, inclusief kozijn op aanvraag", "Both sides, frame on request") },
        { id: "p5", name: L("Buitenschilderwerk", "Exterior painting"), price: 0, unit: L("op aanvraag", "on request"), calc: false, note: L("Na opname ter plaatse", "After an on-site survey") },
      ],
      priceNote: L(
        "Vanaf-prijzen incl. btw en verf. U ontvangt altijd eerst een vaste prijs op maat.",
        "Starting prices incl. VAT and paint. You always receive a fixed tailored price first.",
      ),
      teamTitle: L("Onze schilders aan het werk", "Our painters at work"),
      teamText: L(
        "Zorgvuldige voorbereiding is het halve werk: afplakken, schuren en gronden voordat we schilderen.",
        "Preparation is half the job: masking, sanding and priming before we paint.",
      ),
      teamImages: [paintTeam, paintFrames],
      faqs: [
        { q: L("Welke verf gebruiken jullie?", "Which paint do you use?"), a: L("Wij werken met professionele A-merk verf die goed dekt en lang mooi blijft. Heeft u een voorkeur, dan houden we daar rekening mee.", "We use professional premium paint that covers well and lasts. If you have a preference, we'll take it into account.") },
        { q: L("Moet ik zelf de kleur kiezen?", "Do I choose the colour myself?"), a: L("Ja, maar we adviseren u graag. Stuur ons een foto en uw wensen via WhatsApp.", "Yes, but we're happy to advise. Send us a photo and your wishes via WhatsApp.") },
        { q: L("Hoe snel kunnen jullie beginnen?", "How soon can you start?"), a: L("Meestal kunnen we binnen korte tijd starten. Stuur een WhatsApp, dan plannen we direct samen.", "We can usually start soon. Send a WhatsApp and we'll plan it together right away.") },
        { q: L("Schilderen jullie ook buiten?", "Do you also paint exteriors?"), a: L("Ja, kozijnen, deuren, boeidelen en gevels. Buitenwerk plannen we bij droog weer.", "Yes, frames, doors, fascias and facades. We schedule exterior work in dry weather.") },
      ],
      seoTitle: L("Schilder{in} | Schilderwerk vanaf €11 per m²", "Painter{in} | Painting from €11 per m²"),
      seoDescription: L(
        "Schilderwerk{in} door Oynur Bouw: muren, plafonds, kozijnen en deuren binnen en buiten. Heldere prijzen en een strakke afwerking. Stuur een WhatsApp voor een vrijblijvende offerte.",
        "Painting{in} by Oynur Bouw: walls, ceilings, frames and doors inside and out. Clear prices and a crisp finish. Send a WhatsApp for a free quote.",
      ),
      updatedAt: now,
    },
  };
}
