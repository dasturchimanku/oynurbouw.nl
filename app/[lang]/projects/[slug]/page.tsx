import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Camera, MapPin, Timer } from "lucide-react";
import type { Locale, Project, Settings } from "@/lib/types";
import { locales } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { getProjectBySlug, getPublishedProjects, getSettings } from "@/lib/store";
import { getService } from "@/lib/services";
import { pagePath, projectPath, servicePath } from "@/lib/routes";
import { buildMetadata, samePaths } from "@/lib/seo";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { coverOf } from "@/lib/projects";
import { isStill } from "@/lib/media";
import { waLink } from "@/lib/contact";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PostCarousel, type Slide } from "@/components/site/PostCarousel";
import { ProjectGrid } from "@/components/site/ProjectGrid";
import { ShareButton } from "@/components/site/ShareButton";
import { SocialIcon } from "@/components/SocialIcon";
import { JsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ lang: Locale; slug: string }> };

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));
}

async function load(slug: string) {
  const p = await getProjectBySlug(decodeURIComponent(slug));
  return p && p.published ? p : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = await load(slug);
  if (!p) return {};
  const title = p.seoTitle[lang] || p.title[lang] || p.title.nl;
  const description = (p.seoDescription[lang] || p.summary[lang] || p.summary.nl || p.description[lang] || "").slice(0, 160);
  const cover = coverOf(p);
  return buildMetadata({
    locale: lang,
    title,
    description,
    type: "article",
    paths: samePaths((l) => projectPath(l, p.slug)),
    ...(cover ? { images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt[lang] || title }] } : {}),
  });
}

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function hashtags(project: Project, settings: Settings, locale: Locale) {
  const service = getService(project.category);
  const tags = [
    service?.title[locale],
    project.location || settings.city,
    locale === "nl" ? "renovatie" : "renovation",
    "oynurbouw",
  ]
    .filter(Boolean)
    .map((t) => "#" + String(t).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, ""));
  return [...new Set(tags)];
}

function Account({ settings, sub }: { settings: Settings; sub: string }) {
  const handle = settings.socials.instagram
    ? settings.socials.instagram.replace(/\/+$/, "").split("/").pop()
    : "oynurbouw";
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-tr from-brand to-[#ffb000] p-[2px]">
        <span className="grid size-full place-items-center rounded-full bg-white">
          <Image src="/brand/mark.png" alt="" width={24} height={23} className="w-5" />
        </span>
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-sm font-bold">{handle}</span>
        <span className="block truncate text-xs text-stone">{sub}</span>
      </span>
      {settings.socials.instagram && (
        <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer me" aria-label="Instagram" className="grid size-9 place-items-center rounded-full text-ink hover:bg-sand">
          <SocialIcon name="instagram" className="size-5" />
        </a>
      )}
    </div>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  const project = await load(slug);
  if (!project) notFound();
  const t = getDictionary(lang);
  const [settings, all] = await Promise.all([getSettings(), getPublishedProjects()]);
  const service = getService(project.category);
  const title = project.title[lang] || project.title.nl;
  const summary = project.summary[lang] || project.summary.nl;
  const description = project.description[lang] || project.description.nl;
  const cover = coverOf(project);
  const alt = (i: { alt: { nl: string; en: string } }) => i.alt[lang] || i.alt.nl || title;

  // Cover first, then the rest in the admin order.
  const ordered = cover ? [cover, ...project.images.filter((i) => i.id !== cover.id)] : project.images;
  const slides: Slide[] = ordered.map((i) => ({
    src: i.src,
    width: i.width,
    height: i.height,
    alt: alt(i),
    media: i.media,
    poster: i.poster,
    webm: i.webm,
    badge: i.kind === "before" ? t.projects.before : i.kind === "after" ? t.projects.after : undefined,
  }));

  // "More work": same category first, then the rest.
  const others = all.filter((p) => p.id !== project.id);
  const more = [...others.filter((p) => p.category === project.category), ...others.filter((p) => p.category !== project.category)];

  const sub = [service?.title[lang], project.location || settings.city].filter(Boolean).join(" · ");
  const meta = [
    project.location && { icon: MapPin, value: project.location },
    project.year && { icon: Calendar, value: project.year },
    (project.duration[lang] || project.duration.nl) && { icon: Timer, value: project.duration[lang] || project.duration.nl },
    { icon: Camera, value: `${project.images.length} ${lang === "nl" ? "foto's" : "photos"}` },
  ].filter(Boolean) as { icon: typeof MapPin; value: string }[];

  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    headline: title,
    description: summary || description.slice(0, 200),
    url: absoluteUrl(projectPath(lang, project.slug)),
    image: ordered.filter(isStill).map((i) => ({ "@type": "ImageObject", url: absoluteUrl(i.src), width: i.width, height: i.height, caption: alt(i) })),
    inLanguage: lang === "nl" ? "nl-NL" : "en",
    dateModified: project.updatedAt,
    ...(project.location ? { locationCreated: { "@type": "Place", name: project.location } } : {}),
    ...(service ? { genre: service.title[lang], about: { "@type": "Service", name: service.title[lang] } } : {}),
    creator: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  const carouselLabels = {
    prev: lang === "nl" ? "Vorige foto" : "Previous photo",
    next: lang === "nl" ? "Volgende foto" : "Next photo",
    close: t.nav.close,
    open: lang === "nl" ? "Foto" : "Photo",
  };

  return (
    <>
      <JsonLd data={ld} />
      <div className="pt-16 lg:pt-28">
        <div className="mx-auto max-w-5xl lg:px-8">
          <div className="hidden pb-5 lg:block">
            <Breadcrumbs
              items={[
                { name: t.breadcrumbs.home, path: pagePath(lang, "home") },
                { name: t.nav.projects, path: pagePath(lang, "projects") },
                { name: title, path: projectPath(lang, project.slug) },
              ]}
            />
          </div>

          <article className="overflow-hidden bg-white lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:rounded-2xl lg:border lg:border-line">
            {/* Account row (mobile, above the photo — like Instagram) */}
            <div className="border-b border-line lg:hidden">
              <Account settings={settings} sub={sub} />
            </div>

            <div className="lg:border-r lg:border-line">
              <PostCarousel slides={slides} labels={carouselLabels} />
            </div>

            <div className="flex flex-col">
              <div className="hidden border-b border-line lg:block">
                <Account settings={settings} sub={sub} />
              </div>

              <div className="flex-1 px-4 pt-4 pb-2 lg:max-h-[calc(100dvh-16rem)] lg:overflow-y-auto lg:px-5">
                {service && (
                  <Link href={servicePath(lang, service.key)} className="text-xs font-semibold tracking-wider text-brand uppercase hover:underline">
                    {service.title[lang]}
                  </Link>
                )}
                <h1 className="mt-1 text-2xl leading-tight font-extrabold sm:text-3xl">{title}</h1>
                {summary && <p className="mt-3 font-medium text-ink-700">{summary}</p>}
                {description && (
                  <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-700">
                    {paragraphs(description).map((p) => (
                      <p key={p.slice(0, 40)} className="whitespace-pre-line">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
                <p className="mt-3 text-[15px] text-[#00376b]">{hashtags(project, settings, lang).join(" ")}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {meta.map((m) => (
                    <li key={m.value} className="flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-sm text-ink-700">
                      <m.icon className="size-3.5 text-brand" /> {m.value}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 border-t border-line p-4 lg:px-5">
                <a
                  href={waLink(settings, lang, { project: title })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-white transition hover:bg-[#1ebe5b]"
                >
                  <SocialIcon name="whatsapp" className="size-5" /> {t.projects.ctaTitle}
                </a>
                <ShareButton title={title} label={lang === "nl" ? "Delen" : "Share"} copied={lang === "nl" ? "Link gekopieerd" : "Link copied"} />
              </div>
            </div>
          </article>
        </div>

        {more.length > 0 && (
          <section className="mx-auto max-w-5xl pt-12 pb-16 sm:px-6 lg:px-8 lg:pt-16" aria-labelledby="more-title">
            <div className="mb-4 flex items-end justify-between gap-4 px-4 sm:px-0">
              <h2 id="more-title" className="text-xl font-extrabold sm:text-2xl">
                {lang === "nl" ? "Meer van ons werk" : "More of our work"}
              </h2>
              <Link href={pagePath(lang, "projects")} className="text-sm font-semibold text-brand">
                {t.projects.back}
              </Link>
            </div>
            <ProjectGrid projects={more} locale={lang} />
          </section>
        )}
      </div>
    </>
  );
}
