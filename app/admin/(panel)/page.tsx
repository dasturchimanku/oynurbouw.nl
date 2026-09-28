import Link from "next/link";
import { ArrowRight, CircleCheck, Circle, FolderKanban, Image as ImageIcon, Plus, EyeOff } from "lucide-react";
import { getAllProjects, getSettings } from "@/lib/store";
import { siteUrl } from "@/lib/site";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const [projects, s] = await Promise.all([getAllProjects(), getSettings()]);
  const published = projects.filter((p) => p.published).length;
  const photos = projects.reduce((n, p) => n + p.images.length, 0);
  const socials = Object.values(s.socials).filter(Boolean).length;

  const checklist = [
    { done: !!s.whatsapp, label: "WhatsApp number (customers contact you via WhatsApp)", href: "/admin/settings" },
    { done: socials > 0, label: `Social media profiles (${socials} added)`, href: "/admin/settings#socials" },
    { done: !!s.city, label: "Company city (important for local Google results)", href: "/admin/settings" },
    { done: !!s.heroImage, label: "Homepage photo", href: "/admin/settings#images" },
    { done: published >= 3, label: `At least 3 published projects (${published} now)`, href: "/admin/projects/new" },
    { done: !siteUrl.includes("localhost"), label: "Set NEXT_PUBLIC_SITE_URL to your domain in .env.local", href: null },
  ];
  const todo = checklist.filter((c) => !c.done).length;

  const stats = [
    { label: "Published projects", value: published, icon: FolderKanban },
    { label: "Drafts", value: projects.length - published, icon: EyeOff },
    { label: "Photos", value: photos, icon: ImageIcon },
  ];

  return (
    <>
      <PageHeader
        title="Welcome back 👋"
        text="Manage your portfolio and company details."
        actions={
          <Link href="/admin/projects/new" className="btn-primary">
            <Plus className="size-4" /> New project
          </Link>
        }
      />
      <div className="grid grid-cols-3 gap-4">
        {stats.map((st) => (
          <Link key={st.label} href="/admin/projects" className="card p-5 transition hover:shadow-lift">
            <st.icon className="size-5 text-brand" />
            <p className="mt-4 font-display text-3xl font-extrabold">{st.value}</p>
            <p className="text-sm text-stone">{st.label}</p>
          </Link>
        ))}
      </div>

      <section className="card mt-8 max-w-2xl p-6">
        <h2 className="text-lg font-bold">Website checklist</h2>
        <p className="text-sm text-stone">{todo === 0 ? "Everything is set up. Great job!" : `${todo} item(s) left to complete`}</p>
        <ul className="mt-4 space-y-1">
          {checklist.map((c) => {
            const inner = (
              <>
                {c.done ? <CircleCheck className="size-5 shrink-0 text-green-600" /> : <Circle className="size-5 shrink-0 text-line" />}
                <span className={`flex-1 ${c.done ? "text-stone line-through" : ""}`}>{c.label}</span>
                {!c.done && c.href && <ArrowRight className="size-4 text-stone" />}
              </>
            );
            return (
              <li key={c.label}>
                {c.href && !c.done ? (
                  <Link href={c.href} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-sand/60">
                    {inner}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 px-2 py-2 text-sm">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
