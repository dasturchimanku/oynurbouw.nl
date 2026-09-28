import { ProjectForm } from "@/components/admin/ProjectForm";
import { newDraft } from "@/lib/projects";
import { services } from "@/lib/services";
import { siteUrl } from "@/lib/site";

export const metadata = { title: "New project" };

export default function NewProjectPage() {
  return <ProjectForm initial={newDraft()} services={services.map((s) => ({ key: s.key, label: s.title.en }))} siteUrl={siteUrl} />;
}
