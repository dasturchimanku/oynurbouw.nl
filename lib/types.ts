export const locales = ["nl", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "nl";

export type Localized = { nl: string; en: string };

export type ImageKind = "gallery" | "before" | "after";

export type MediaType = "image" | "gif" | "video";

export type ProjectImage = {
  id: string;
  src: string; // e.g. /media/abc123.webp, /media/abc.gif, /media/abc.mp4
  width: number;
  height: number;
  alt: Localized;
  kind: ImageKind;
  /** "gif" = animated image, "video" = looping muted video. Missing = derived from the file extension. */
  media?: MediaType;
  /** Still frame shown while a video loads. */
  poster?: string;
  /** Optional WebM version of a video (played first when the browser supports it). */
  webm?: string;
};

export type Project = {
  id: string;
  slug: string;
  title: Localized;
  summary: Localized;
  description: Localized;
  category: string; // service key
  location: string;
  year: string;
  duration: Localized;
  images: ProjectImage[];
  coverImageId: string | null;
  published: boolean;
  featured: boolean;
  order: number;
  seoTitle: Localized;
  seoDescription: Localized;
  createdAt: string;
  updatedAt: string;
};

export const socialKeys = [
  "instagram",
  "tiktok",
  "facebook",
  "linkedin",
  "youtube",
  "pinterest",
  "x",
  "google",
  "werkspot",
] as const;
export type SocialKey = (typeof socialKeys)[number];

export type Settings = {
  companyName: string;
  tagline: Localized;
  phone: string;
  whatsapp: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  kvk: string;
  btw: string;
  iban: string;
  serviceArea: Localized;
  openingHours: Localized;
  socials: Record<SocialKey, string>;
  stats: {
    yearsExperience: string;
    projectsCompleted: string;
    rating: string;
  };
  heroImage: ProjectImage | null;
  aboutImage: ProjectImage | null;
  updatedAt: string;
};

export type Database = {
  version: 1;
  settings: Settings;
  projects: Project[];
  landings: Record<LandingKey, Landing>;
};

/* ── Landing pages (Stucwerk / Schilderwerk) ───────────────── */

export const landingKeys = ["stucwerk", "schilderwerk"] as const;
export type LandingKey = (typeof landingKeys)[number];

export type PriceItem = {
  id: string;
  name: Localized;
  /** Starting price in euros, e.g. 16 */
  price: number;
  /** Unit shown after the price, e.g. { nl: "per m²", en: "per m²" } */
  unit: Localized;
  /** true = the calculator multiplies the price by the entered amount */
  calc: boolean;
  note: Localized;
};

export type Landing = {
  key: LandingKey;
  published: boolean;
  eyebrow: Localized;
  title: Localized;
  titleAccent: Localized;
  text: Localized;
  heroImage: ProjectImage | null;
  usps: Localized[];
  servicesTitle: Localized;
  services: { title: Localized; text: Localized }[];
  prices: PriceItem[];
  priceNote: Localized;
  teamTitle: Localized;
  teamText: Localized;
  teamImages: ProjectImage[];
  faqs: { q: Localized; a: Localized }[];
  seoTitle: Localized;
  seoDescription: Localized;
  updatedAt: string;
};
