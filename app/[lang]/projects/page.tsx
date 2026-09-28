import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary, withCity } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import { buildMetadata, samePaths } from "@/lib/seo";
import { getPublishedProjects, getSettings } from "@/lib/store";
import { absoluteUrl } from "@/lib/site";
import { coverOf } from "@/lib/projects";
import { projectPath } from "@/lib/routes";
import { PageHero } from "@/components/site/PageHero";
import { ProjectCard } from "@/components/site/ProjectCard";
import { CtaBanner } from "@/components/site/CtaBanner";
import { JsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  const projects = await getPublishedProjects();
  const cover = projects.map(coverOf).find(Boolean);
  return buildMetadata({
    locale: lang,
    title: withCity(t.projects.metaTitle, (await getSettings()).city, lang),
    description: withCity(t.projects.metaDescription, (await getSettings()).city, lang),
    paths: samePaths((l) => pagePath(l, "projects")),
    ...(cover ? { images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt[lang] }] } : {}),
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang);
  const [projects, settings] = await Promise.all([getPublishedProjects(), getSettings()]);

  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(projectPath(lang, p.slug)),
      name: p.title[lang] || p.title.nl,
    })),
  };

  return (
    <>
      {projects.length > 0 && <JsonLd data={listLd} />}
      <PageHero
        title={t.projects.title}
        text={t.projects.text}
        crumbs={[
          { name: t.breadcrumbs.home, path: pagePath(lang, "home") },
          { name: t.nav.projects, path: pagePath(lang, "projects") },
        ]}
      />
      <section className="container-x pb-8">
        {projects.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-stone">{t.projects.empty}</p>
        ) : (
          <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <li key={p.id}>
                <ProjectCard project={p} locale={lang} priority={i < 2} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <CtaBanner locale={lang} settings={settings} />
    </>
  );
}
