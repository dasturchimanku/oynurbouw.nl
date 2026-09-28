import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectById } from "@/lib/store";
import { services } from "@/lib/services";
import { siteUrl } from "@/lib/site";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProjectById(id);
  if (!p) notFound();
  const { createdAt: _c, updatedAt: _u, order: _o, ...draft } = p;
  return <ProjectForm initial={draft} services={services.map((s) => ({ key: s.key, label: s.title.en }))} siteUrl={siteUrl} />;
}
