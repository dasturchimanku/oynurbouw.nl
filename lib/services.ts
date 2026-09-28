import type { Locale, Localized } from "./types";

export type ServiceIcon = "bath" | "kitchen" | "house" | "extension" | "tiles" | "plaster" | "paint" | "floor";

export type Service = {
  key: string;
  icon: ServiceIcon;
  slug: Localized;
  title: Localized;
  short: Localized;
  metaDescription: Localized;
  intro: { nl: string[]; en: string[] };
  includes: { nl: string[]; en: string[] };
  faqs: { nl: { q: string; a: string }[]; en: { q: string; a: string }[] };
};

export const services: Service[] = [
  {
    key: "bathroom",
    icon: "bath",
    slug: { nl: "badkamer-renovatie", en: "bathroom-renovation" },
    title: { nl: "Badkamer renovatie", en: "Bathroom renovation" },
    short: {
      nl: "Van slopen tot de laatste kitnaad: een complete nieuwe badkamer, strak afgewerkt en waterdicht.",
      en: "From demolition to the final sealant joint: a complete new bathroom, neatly finished and watertight.",
    },
    metaDescription: {
      nl: "Badkamer laten renoveren? Oynur Bouw verzorgt sloopwerk, leidingwerk, tegelwerk, inloopdouches en complete afwerking. Vraag vrijblijvend een offerte aan.",
      en: "Planning a bathroom renovation? Oynur Bouw handles demolition, plumbing, tiling, walk-in showers and the complete finish. Request a free quote.",
    },
    intro: {
      nl: [
        "Een nieuwe badkamer is een van de beste investeringen in uw woning. Wij nemen het hele traject uit handen: van het ontwerp en het slopen van de oude badkamer tot het leidingwerk, de elektra, de waterdichting, het tegelwerk en de montage van sanitair.",
        "U heeft één aanspreekpunt en een duidelijke planning, zodat u precies weet waar u aan toe bent en zo snel mogelijk weer kunt genieten van uw nieuwe badkamer.",
      ],
      en: [
        "A new bathroom is one of the best investments you can make in your home. We take care of the entire process: from design and removing the old bathroom to plumbing, electrics, waterproofing, tiling and fitting the sanitary ware.",
        "You have one point of contact and a clear schedule, so you always know where you stand and can enjoy your new bathroom as soon as possible.",
      ],
    },
    includes: {
      nl: [
        "Slopen en afvoeren van de oude badkamer",
        "Aanpassen van leidingwerk en afvoer",
        "Elektra, verlichting en vloerverwarming",
        "Waterdicht maken van vloer en wanden",
        "Wand- en vloertegels, ook grootformaat",
        "Inloopdouche, bad, toilet en badmeubel plaatsen",
      ],
      en: [
        "Removal and disposal of the old bathroom",
        "Adjusting water supply and drainage",
        "Electrics, lighting and underfloor heating",
        "Waterproofing floors and walls",
        "Wall and floor tiling, including large formats",
        "Installing walk-in shower, bath, toilet and vanity",
      ],
    },
    faqs: {
      nl: [
        {
          q: "Hoe lang duurt een badkamerrenovatie?",
          a: "Een gemiddelde badkamer is doorgaans binnen twee tot drie weken klaar. De exacte duur hangt af van de grootte, het leidingwerk en de gekozen materialen. U krijgt vooraf een duidelijke planning.",
        },
        {
          q: "Kan ik mijn eigen tegels en sanitair kiezen?",
          a: "Zeker. U kunt zelf materialen uitzoeken of wij adviseren u over tegels en sanitair die passen bij uw wensen en budget.",
        },
        {
          q: "Wat kost een nieuwe badkamer?",
          a: "Dat hangt af van de afmetingen, de gewenste afwerking en de materialen. Na een bezoek ter plaatse ontvangt u een heldere offerte zonder verrassingen achteraf.",
        },
      ],
      en: [
        {
          q: "How long does a bathroom renovation take?",
          a: "An average bathroom is usually finished within two to three weeks. The exact duration depends on the size, the plumbing and the chosen materials. You will receive a clear schedule in advance.",
        },
        {
          q: "Can I choose my own tiles and fixtures?",
          a: "Absolutely. You can select materials yourself, or we can advise you on tiles and fixtures that fit your wishes and budget.",
        },
        {
          q: "How much does a new bathroom cost?",
          a: "That depends on the size, the finish you want and the materials. After a site visit you receive a clear quote with no surprises afterwards.",
        },
      ],
    },
  },
  {
    key: "kitchen",
    icon: "kitchen",
    slug: { nl: "keuken-renovatie", en: "kitchen-renovation" },
    title: { nl: "Keuken renovatie", en: "Kitchen renovation" },
    short: {
      nl: "Een nieuwe keuken inclusief voorbereidend werk: leidingen, elektra, wanden, vloer en montage.",
      en: "A new kitchen including all preparation: plumbing, electrics, walls, flooring and installation.",
    },
    metaDescription: {
      nl: "Keuken renoveren of een nieuwe keuken laten plaatsen? Wij verzorgen leidingwerk, elektra, stucwerk, tegelwerk en montage. Vraag een vrijblijvende offerte aan.",
      en: "Renovating your kitchen or having a new one installed? We take care of plumbing, electrics, plastering, tiling and installation. Request a free quote.",
    },
    intro: {
      nl: [
        "De keuken is het hart van het huis. Of u nu een compleet nieuwe keuken wilt of de bestaande ruimte wilt vernieuwen: wij zorgen voor een vakkundige uitvoering van begin tot eind.",
        "We verplaatsen leidingen en aansluitpunten, leggen nieuwe groepen aan, werken wanden strak af en monteren de keuken met oog voor detail.",
      ],
      en: [
        "The kitchen is the heart of the home. Whether you want a completely new kitchen or want to refresh the existing space, we deliver skilled workmanship from start to finish.",
        "We relocate pipes and connection points, install new electrical circuits, finish walls smoothly and fit the kitchen with an eye for detail.",
      ],
    },
    includes: {
      nl: [
        "Demontage en afvoer van de oude keuken",
        "Verplaatsen van water, afvoer en gas/inductie-aansluiting",
        "Nieuwe elektragroepen en verlichting",
        "Stucwerk en tegelwerk achter het werkblad",
        "Plaatsen en afmonteren van de keuken",
        "Afwerking met plinten en kitwerk",
      ],
      en: [
        "Dismantling and disposal of the old kitchen",
        "Relocating water, drainage and gas/induction connections",
        "New electrical circuits and lighting",
        "Plastering and splashback tiling",
        "Installing and finishing the kitchen",
        "Final finish with skirting and sealant",
      ],
    },
    faqs: {
      nl: [
        {
          q: "Plaatsen jullie ook een keuken die ik elders heb gekocht?",
          a: "Ja. Wij kunnen de keuken van uw keuze plaatsen en zorgen tegelijk voor al het bouwkundige voorwerk.",
        },
        {
          q: "Kan ik tijdens de verbouwing thuis blijven wonen?",
          a: "Meestal wel. We stemmen de planning met u af en zorgen dat de overlast zo beperkt mogelijk blijft.",
        },
      ],
      en: [
        {
          q: "Do you also install a kitchen I bought elsewhere?",
          a: "Yes. We can install the kitchen of your choice and take care of all the construction preparation at the same time.",
        },
        {
          q: "Can I stay at home during the renovation?",
          a: "Usually, yes. We agree on the schedule with you and keep the disruption to a minimum.",
        },
      ],
    },
  },
  {
    key: "full-renovation",
    icon: "house",
    slug: { nl: "complete-woningrenovatie", en: "full-home-renovation" },
    title: { nl: "Complete woningrenovatie", en: "Full home renovation" },
    short: {
      nl: "Uw hele woning vernieuwd door één team, met één planning en één aanspreekpunt.",
      en: "Your entire home renewed by one team, with one schedule and one point of contact.",
    },
    metaDescription: {
      nl: "Complete woningrenovatie door Oynur Bouw: sloopwerk, indeling aanpassen, installaties, afbouw en afwerking. Eén aanspreekpunt van start tot oplevering.",
      en: "Full home renovation by Oynur Bouw: demolition, layout changes, installations, interior construction and finishing. One point of contact from start to handover.",
    },
    intro: {
      nl: [
        "Een woning helemaal naar uw smaak maken vraagt om een goede coördinatie. Wij stemmen alle werkzaamheden op elkaar af, zodat sloopwerk, installaties, afbouw en afwerking soepel in elkaar overlopen.",
        "Zo voorkomt u losse aannemers, dubbel werk en vertraging. U heeft één aanspreekpunt dat het overzicht houdt en u op de hoogte houdt van de voortgang.",
      ],
      en: [
        "Making a home completely your own requires good coordination. We align all work so that demolition, installations, interior construction and finishing flow smoothly into one another.",
        "That way you avoid separate contractors, duplicated work and delays. You have one point of contact who keeps the overview and keeps you informed of progress.",
      ],
    },
    includes: {
      nl: [
        "Opname, advies en heldere offerte",
        "Sloopwerk en aanpassen van de indeling",
        "Nieuwe wanden, plafonds en deuren",
        "Water, afvoer, elektra en verwarming",
        "Badkamer, keuken en toilet",
        "Stucwerk, schilderwerk en vloeren",
      ],
      en: [
        "Survey, advice and a clear quote",
        "Demolition and layout changes",
        "New walls, ceilings and doors",
        "Plumbing, drainage, electrics and heating",
        "Bathroom, kitchen and toilet",
        "Plastering, painting and flooring",
      ],
    },
    faqs: {
      nl: [
        {
          q: "Waarom één partij voor de hele renovatie?",
          a: "Eén partij betekent één planning en één verantwoordelijke. Dat scheelt afstemming, voorkomt fouten tussen verschillende vakmensen en levert meestal tijdwinst op.",
        },
        {
          q: "Helpen jullie ook bij het maken van keuzes?",
          a: "Ja, wij denken graag mee over indeling, materialen en afwerking, zodat het resultaat past bij uw wensen en budget.",
        },
      ],
      en: [
        {
          q: "Why one company for the entire renovation?",
          a: "One company means one schedule and one party responsible. That saves coordination, prevents mistakes between different trades and usually saves time.",
        },
        {
          q: "Do you help with making choices?",
          a: "Yes, we are happy to advise on layout, materials and finishes so the result matches your wishes and budget.",
        },
      ],
    },
  },
  {
    key: "extension",
    icon: "extension",
    slug: { nl: "aanbouw-en-uitbouw", en: "home-extensions" },
    title: { nl: "Aanbouw & uitbouw", en: "Home extensions" },
    short: {
      nl: "Meer leefruimte met een uitbouw aan de achterzijde of een aanbouw naast uw woning.",
      en: "More living space with a rear extension or a side addition to your home.",
    },
    metaDescription: {
      nl: "Een aanbouw of uitbouw laten bouwen? Oynur Bouw realiseert extra leefruimte van fundering tot afwerking. Vraag een vrijblijvende offerte aan.",
      en: "Want a home extension built? Oynur Bouw creates extra living space from foundation to finish. Request a free quote.",
    },
    intro: {
      nl: [
        "Een uitbouw is een slimme manier om meer ruimte te creëren zonder te verhuizen. Denk aan een grotere woonkeuken, een lichte leefruimte met veel glas of een extra werkkamer.",
        "Wij verzorgen de bouw van fundering tot dak en werken de nieuwe ruimte af zodat deze naadloos aansluit op uw bestaande woning.",
      ],
      en: [
        "An extension is a smart way to create more space without moving. Think of a larger kitchen-diner, a bright living area with lots of glass, or an extra study.",
        "We build from foundation to roof and finish the new space so it blends seamlessly with your existing home.",
      ],
    },
    includes: {
      nl: [
        "Advies over mogelijkheden en vergunningen",
        "Fundering, vloer en casco",
        "Dak, isolatie en kozijnen",
        "Doorbraak naar de bestaande woning",
        "Installaties en afwerking",
      ],
      en: [
        "Advice on possibilities and permits",
        "Foundation, floor and shell",
        "Roof, insulation and window frames",
        "Opening into the existing house",
        "Installations and finishing",
      ],
    },
    faqs: {
      nl: [
        {
          q: "Heb ik een vergunning nodig voor een uitbouw?",
          a: "Dat hangt af van de afmetingen en de locatie. Veel uitbouwen aan de achterzijde zijn vergunningsvrij, maar dat verschilt per situatie. Wij helpen u dit uit te zoeken.",
        },
      ],
      en: [
        {
          q: "Do I need a permit for an extension?",
          a: "That depends on the size and location. Many rear extensions do not require a permit, but it varies per situation. We help you find out.",
        },
      ],
    },
  },
  {
    key: "tiling",
    icon: "tiles",
    slug: { nl: "tegelwerk", en: "tiling" },
    title: { nl: "Tegelwerk", en: "Tiling" },
    short: {
      nl: "Strak tegelwerk voor vloeren en wanden, van klassiek tot grootformaat.",
      en: "Precise tiling for floors and walls, from classic to large-format.",
    },
    metaDescription: {
      nl: "Vakkundig tegelwerk voor badkamer, keuken, toilet en woonkamer. Wand- en vloertegels, ook grootformaat. Vraag een offerte aan bij Oynur Bouw.",
      en: "Professional tiling for bathrooms, kitchens, toilets and living rooms. Wall and floor tiles, including large formats. Request a quote from Oynur Bouw.",
    },
    intro: {
      nl: [
        "Goed tegelwerk valt op door de details: rechte voegen, strakke hoeken en een vlakke ondergrond. Wij tegelen vloeren en wanden in badkamers, keukens, toiletten en woonruimtes.",
        "Ook grootformaat tegels en visgraatpatronen behoren tot de mogelijkheden.",
      ],
      en: [
        "Good tiling stands out in the details: straight joints, crisp corners and a level substrate. We tile floors and walls in bathrooms, kitchens, toilets and living areas.",
        "Large-format tiles and herringbone patterns are also possible.",
      ],
    },
    includes: {
      nl: ["Egaliseren en voorbereiden van de ondergrond", "Wand- en vloertegels", "Grootformaat en patronen", "Voegen en kitwerk"],
      en: ["Levelling and preparing the substrate", "Wall and floor tiles", "Large formats and patterns", "Grouting and sealing"],
    },
    faqs: { nl: [], en: [] },
  },
  {
    key: "plastering",
    icon: "plaster",
    slug: { nl: "stucwerk-en-wanden", en: "plastering-and-walls" },
    title: { nl: "Stucwerk & wanden", en: "Plastering & walls" },
    short: {
      nl: "Nieuwe scheidingswanden, gipsplaten plafonds en glad stucwerk, klaar voor de verf.",
      en: "New partition walls, plasterboard ceilings and smooth plastering, ready for paint.",
    },
    metaDescription: {
      nl: "Stucwerk, metal-stud wanden en gipsplaten plafonds door Oynur Bouw. Strak afgewerkt en klaar om te schilderen. Vraag een vrijblijvende offerte aan.",
      en: "Plastering, metal-stud partition walls and plasterboard ceilings by Oynur Bouw. Smoothly finished and ready to paint. Request a free quote.",
    },
    intro: {
      nl: [
        "Wilt u de indeling van uw woning aanpassen of uw muren en plafonds weer strak hebben? Wij plaatsen nieuwe wanden en verzorgen het stucwerk tot een egaal, glad eindresultaat.",
      ],
      en: [
        "Want to change the layout of your home or have your walls and ceilings perfectly smooth again? We build new walls and plaster them to an even, smooth finish.",
      ],
    },
    includes: {
      nl: ["Metal-stud en gipsplaten wanden", "Verlaagde plafonds", "Glad stucwerk en behangklaar werk", "Geluids- en warmte-isolatie"],
      en: ["Metal-stud and plasterboard walls", "Suspended ceilings", "Smooth and paint-ready plastering", "Sound and thermal insulation"],
    },
    faqs: { nl: [], en: [] },
  },
  {
    key: "painting",
    icon: "paint",
    slug: { nl: "schilderwerk", en: "painting" },
    title: { nl: "Schilderwerk", en: "Painting" },
    short: {
      nl: "Binnen- en buitenschilderwerk met een duurzame, strakke afwerking.",
      en: "Interior and exterior painting with a durable, clean finish.",
    },
    metaDescription: {
      nl: "Binnen- en buitenschilderwerk door Oynur Bouw: wanden, plafonds, kozijnen en deuren. Zorgvuldig voorbereid en strak afgewerkt.",
      en: "Interior and exterior painting by Oynur Bouw: walls, ceilings, frames and doors. Carefully prepared and neatly finished.",
    },
    intro: {
      nl: [
        "Een goede verflaag begint bij de voorbereiding. Wij plamuren, schuren en gronden zorgvuldig voordat we schilderen, zodat het resultaat mooi blijft.",
      ],
      en: [
        "A good coat of paint starts with preparation. We fill, sand and prime carefully before painting, so the result stays beautiful.",
      ],
    },
    includes: {
      nl: ["Wanden en plafonds", "Kozijnen, deuren en trappen", "Buitenschilderwerk", "Reparatie van houtwerk"],
      en: ["Walls and ceilings", "Frames, doors and stairs", "Exterior painting", "Woodwork repair"],
    },
    faqs: { nl: [], en: [] },
  },
  {
    key: "flooring",
    icon: "floor",
    slug: { nl: "vloeren", en: "flooring" },
    title: { nl: "Vloeren", en: "Flooring" },
    short: {
      nl: "PVC, laminaat, parket of een tegelvloer: inclusief egaliseren en plinten.",
      en: "Vinyl, laminate, parquet or a tiled floor: including levelling and skirting.",
    },
    metaDescription: {
      nl: "Nieuwe vloer laten leggen? Oynur Bouw legt PVC, laminaat, parket en tegelvloeren, inclusief egaliseren en afwerking met plinten.",
      en: "Need a new floor? Oynur Bouw installs vinyl, laminate, parquet and tiled floors, including levelling and skirting.",
    },
    intro: {
      nl: [
        "Een nieuwe vloer verandert direct de uitstraling van uw woning. Wij zorgen voor een vlakke ondergrond en leggen de vloer nauwkeurig, met een nette afwerking langs wanden en deuren.",
      ],
      en: [
        "A new floor instantly changes the look of your home. We make sure the substrate is level and lay the floor precisely, with a neat finish along walls and doors.",
      ],
    },
    includes: {
      nl: ["Verwijderen van de oude vloer", "Egaliseren van de ondervloer", "PVC, laminaat, parket of tegels", "Plinten en overgangsprofielen"],
      en: ["Removing the old floor", "Levelling the subfloor", "Vinyl, laminate, parquet or tiles", "Skirting and transition profiles"],
    },
    faqs: { nl: [], en: [] },
  },
];

export function getService(key: string) {
  return services.find((s) => s.key === key) || null;
}

export function getServiceBySlug(locale: Locale, slug: string) {
  return services.find((s) => s.slug[locale] === slug) || services.find((s) => s.slug.nl === slug || s.slug.en === slug) || null;
}
