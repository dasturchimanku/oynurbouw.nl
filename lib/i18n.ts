import { locales, type Locale } from "./types";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Replace {in} with " in <city>" (or nothing when no city is set). */
export function withCity(text: string, city: string, locale: Locale) {
  const c = city ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() : "";
  return text.replace(/\s?\{in\}/g, c ? ` ${locale === "nl" ? "in" : "in"} ${c}` : "").replace(/\{city\}/g, c);
}

const nl = {
  langName: "Nederlands",
  ogLocale: "nl_NL",
  nav: {
    home: "Home",
    services: "Diensten",
    projects: "Projecten",
    about: "Over ons",
    contact: "Contact",
    menu: "Menu",
    close: "Sluiten",
    skip: "Direct naar de inhoud",
  },
  wa: {
    button: "WhatsApp ons",
    short: "WhatsApp",
    call: "Bellen",
    message: "Hallo Oynur Bouw, ik heb een vraag over een renovatie.",
    messageAbout: "Hallo Oynur Bouw, ik wil graag een offerte voor: {topic}.",
    messageProject: "Hallo Oynur Bouw, ik zag het project \"{topic}\" op jullie website en wil graag iets vergelijkbaars.",
  },
  home: {
    metaTitle: "Renovatiebedrijf{in} | Badkamer, vloeren & verbouw",
    metaDescription:
      "Oynur Bouw B.V. is uw renovatiebedrijf{in}: badkamerrenovatie, laminaat en vloeren, tegelwerk, stucwerk en schilderwerk. Stuur een WhatsApp en ontvang snel een vrijblijvende offerte.",
    eyebrow: "Renovatiebedrijf{in}",
    heroTitle: "Renovatie en verbouw,",
    heroTitleAccent: "strak afgewerkt.",
    heroText:
      "Wij renoveren badkamers, leggen vloeren en verzorgen tegel-, stuc- en schilderwerk. Stuur een WhatsApp met een foto van uw ruimte en ontvang snel een vrijblijvende offerte.",
    heroCta2: "Bekijk projecten",
    usp: ["Snel antwoord via WhatsApp", "Vrijblijvende offerte", "Netjes opgeleverd"],
    servicesTitle: "Onze diensten",
    servicesText: "Eén vakkundig team voor de hele klus.",
    allServices: "Alle diensten",
    projectsTitle: "Recente projecten",
    projectsText: "Echte foto's van ons werk.",
    allProjects: "Alle projecten",
    stepsTitle: "Zo eenvoudig werkt het",
    steps: [
      { t: "Stuur een WhatsApp", d: "Vertel kort wat u wilt en stuur een paar foto's van de ruimte." },
      { t: "Advies & offerte", d: "We denken mee, komen indien nodig langs en sturen een heldere offerte." },
      { t: "Uitvoering", d: "Wij voeren het werk vakkundig uit en leveren alles netjes op." },
    ],
  },
  cta: {
    title: "Plannen voor uw woning?",
    text: "Stuur ons een WhatsApp met een foto. U krijgt snel een reactie en een vrijblijvende offerte.",
    call: "Of bel",
  },
  services: {
    metaTitle: "Diensten{in} | Badkamer, vloeren, tegel- & schilderwerk",
    metaDescription:
      "Alle diensten van Oynur Bouw{in}: badkamerrenovatie, keukenrenovatie, complete woningrenovatie, aanbouw, tegelwerk, stucwerk, schilderwerk en vloeren.",
    title: "Onze diensten",
    text: "Van één ruimte tot de complete woning: wij verzorgen renovatie en verbouw met oog voor detail.",
    more: "Meer informatie",
    includes: "Wat wij voor u doen",
    faq: "Veelgestelde vragen",
    related: "Projecten",
    other: "Andere diensten",
    ctaTitle: "Offerte voor {topic}?",
    ctaText: "Stuur een WhatsApp met een paar foto's en uw wensen. We reageren snel.",
  },
  projects: {
    metaTitle: "Projecten | Portfolio van onze renovaties{in}",
    metaDescription:
      "Bekijk projecten van Oynur Bouw: gerenoveerde badkamers, nieuwe vloeren, tegelwerk en schilderwerk. Echte foto's van ons werk{in}.",
    title: "Projecten",
    text: "Echte foto's van ons werk. Elk project met dezelfde aandacht voor afwerking.",
    empty: "Binnenkort vindt u hier onze nieuwste projecten.",
    view: "Bekijk project",
    location: "Locatie",
    year: "Jaar",
    duration: "Duur",
    category: "Categorie",
    before: "Voor",
    after: "Na",
    gallery: "Foto's",
    beforeAfter: "Voor & na",
    back: "Alle projecten",
    next: "Volgend project",
    photoOf: "Foto {i} van {n}",
    ctaTitle: "Ook zo'n resultaat?",
  },
  about: {
    metaTitle: "Over ons | Renovatiebedrijf Oynur Bouw{in}",
    metaDescription:
      "Maak kennis met Oynur Bouw B.V.: renovatie en verbouw met vakmanschap, duidelijke afspraken en een nette oplevering.",
    title: "Over Oynur Bouw",
    lead: "Een verbouwing hoort zorgeloos te verlopen. Daarom combineren we vakmanschap met duidelijke afspraken die we nakomen.",
    body: [
      "Oynur Bouw B.V. is een allround renovatiebedrijf. We renoveren badkamers en toiletten, leggen vloeren en verzorgen tegelwerk, stucwerk en schilderwerk — van één ruimte tot de complete woning.",
      "U heeft één vast aanspreekpunt en bent via WhatsApp altijd snel in contact met ons. We denken mee, geven eerlijk advies en leveren pas op als u tevreden bent.",
    ],
    valuesTitle: "Waar wij voor staan",
    values: [
      { t: "Kwaliteit", d: "Goede materialen en strak werk dat jarenlang meegaat." },
      { t: "Afspraak is afspraak", d: "Duidelijk over planning, kosten en werkzaamheden." },
      { t: "Snel bereikbaar", d: "Een vraag? Stuur een WhatsApp, u krijgt snel antwoord." },
    ],
  },
  contact: {
    metaTitle: "Contact | WhatsApp of bel Oynur Bouw",
    metaDescription:
      "Neem contact op met Oynur Bouw B.V. via WhatsApp of telefoon (085 333 2537) voor een vrijblijvende offerte voor uw renovatie.",
    title: "Contact",
    text: "De snelste manier: stuur ons een WhatsApp met een korte omschrijving en een paar foto's. We reageren zo snel mogelijk.",
    waTitle: "Stuur een WhatsApp",
    waText: "Meestal dezelfde dag antwoord",
    phone: "Telefoon",
    email: "E-mail",
    hours: "Openingstijden",
    area: "Werkgebied",
    follow: "Volg ons",
    company: "Bedrijfsgegevens",
    iban: "IBAN",
  },
  privacy: {
    metaTitle: "Privacyverklaring",
    metaDescription: "Lees hoe Oynur Bouw B.V. omgaat met uw persoonsgegevens.",
    title: "Privacyverklaring",
  },
  footer: {
    about: "Renovatie en verbouw met vakmanschap.",
    navigation: "Menu",
    services: "Diensten",
    contact: "Contact",
    kvk: "KvK",
    btw: "Btw",
    rights: "Alle rechten voorbehouden.",
  },
  notFound: {
    title: "Pagina niet gevonden",
    text: "De pagina die u zoekt bestaat niet (meer).",
    home: "Naar de homepage",
  },
  breadcrumbs: { home: "Home" },
};

export type Dictionary = typeof nl;

const en: Dictionary = {
  langName: "English",
  ogLocale: "en_US",
  nav: {
    home: "Home",
    services: "Services",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    skip: "Skip to content",
  },
  wa: {
    button: "WhatsApp us",
    short: "WhatsApp",
    call: "Call",
    message: "Hello Oynur Bouw, I have a question about a renovation.",
    messageAbout: "Hello Oynur Bouw, I would like a quote for: {topic}.",
    messageProject: "Hello Oynur Bouw, I saw the project \"{topic}\" on your website and would like something similar.",
  },
  home: {
    metaTitle: "Renovation company{in} | Bathrooms, floors & remodelling",
    metaDescription:
      "Oynur Bouw B.V. is your renovation company{in}: bathroom renovation, laminate and flooring, tiling, plastering and painting. Send a WhatsApp and get a free quote fast.",
    eyebrow: "Renovation company{in}",
    heroTitle: "Renovation and remodelling,",
    heroTitleAccent: "perfectly finished.",
    heroText:
      "We renovate bathrooms, lay floors and take care of tiling, plastering and painting. Send a WhatsApp with a photo of your space and get a free quote fast.",
    heroCta2: "View projects",
    usp: ["Fast reply via WhatsApp", "Free quote", "Neatly delivered"],
    servicesTitle: "Our services",
    servicesText: "One skilled team for the whole job.",
    allServices: "All services",
    projectsTitle: "Recent projects",
    projectsText: "Real photos of our work.",
    allProjects: "All projects",
    stepsTitle: "How it works",
    steps: [
      { t: "Send a WhatsApp", d: "Tell us briefly what you want and send a few photos of the space." },
      { t: "Advice & quote", d: "We share ideas, visit if needed and send a clear quote." },
      { t: "Execution", d: "We carry out the work skilfully and deliver everything neatly." },
    ],
  },
  cta: {
    title: "Plans for your home?",
    text: "Send us a WhatsApp with a photo. You'll get a quick reply and a free quote.",
    call: "Or call",
  },
  services: {
    metaTitle: "Services{in} | Bathrooms, floors, tiling & painting",
    metaDescription:
      "All Oynur Bouw services{in}: bathroom renovation, kitchen renovation, full home renovation, extensions, tiling, plastering, painting and flooring.",
    title: "Our services",
    text: "From a single room to the complete home: renovation and remodelling with attention to detail.",
    more: "Learn more",
    includes: "What we do for you",
    faq: "Frequently asked questions",
    related: "Projects",
    other: "Other services",
    ctaTitle: "A quote for {topic}?",
    ctaText: "Send a WhatsApp with a few photos and your wishes. We reply quickly.",
  },
  projects: {
    metaTitle: "Projects | Portfolio of our renovations{in}",
    metaDescription:
      "Browse Oynur Bouw projects: renovated bathrooms, new floors, tiling and painting. Real photos of our work{in}.",
    title: "Projects",
    text: "Real photos of our work. Every project with the same attention to finish.",
    empty: "Our latest projects will appear here soon.",
    view: "View project",
    location: "Location",
    year: "Year",
    duration: "Duration",
    category: "Category",
    before: "Before",
    after: "After",
    gallery: "Photos",
    beforeAfter: "Before & after",
    back: "All projects",
    next: "Next project",
    photoOf: "Photo {i} of {n}",
    ctaTitle: "Want a result like this?",
  },
  about: {
    metaTitle: "About us | Renovation company Oynur Bouw{in}",
    metaDescription: "Meet Oynur Bouw B.V.: renovation and remodelling with craftsmanship, clear agreements and a tidy handover.",
    title: "About Oynur Bouw",
    lead: "A renovation should be stress-free. That's why we combine craftsmanship with clear agreements we keep.",
    body: [
      "Oynur Bouw B.V. is an all-round renovation company. We renovate bathrooms and toilets, lay floors and take care of tiling, plastering and painting — from a single room to the complete home.",
      "You have one dedicated point of contact and can always reach us quickly via WhatsApp. We think along, give honest advice and only hand over when you're satisfied.",
    ],
    valuesTitle: "What we stand for",
    values: [
      { t: "Quality", d: "Good materials and precise work that lasts for years." },
      { t: "A deal is a deal", d: "Clear about schedule, costs and work." },
      { t: "Easy to reach", d: "A question? Send a WhatsApp and get a quick answer." },
    ],
  },
  contact: {
    metaTitle: "Contact | WhatsApp or call Oynur Bouw",
    metaDescription: "Contact Oynur Bouw B.V. via WhatsApp or phone (085 333 2537) for a free quote for your renovation.",
    title: "Contact",
    text: "The fastest way: send us a WhatsApp with a short description and a few photos. We reply as soon as possible.",
    waTitle: "Send a WhatsApp",
    waText: "Usually a reply the same day",
    phone: "Phone",
    email: "Email",
    hours: "Opening hours",
    area: "Service area",
    follow: "Follow us",
    company: "Company details",
    iban: "IBAN",
  },
  privacy: {
    metaTitle: "Privacy statement",
    metaDescription: "Read how Oynur Bouw B.V. handles your personal data.",
    title: "Privacy statement",
  },
  footer: {
    about: "Renovation and remodelling with craftsmanship.",
    navigation: "Menu",
    services: "Services",
    contact: "Contact",
    kvk: "CoC",
    btw: "VAT",
    rights: "All rights reserved.",
  },
  notFound: {
    title: "Page not found",
    text: "The page you're looking for doesn't exist (anymore).",
    home: "Go to homepage",
  },
  breadcrumbs: { home: "Home" },
};

const dictionaries: Record<Locale, Dictionary> = { nl, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
