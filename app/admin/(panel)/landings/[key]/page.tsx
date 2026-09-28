import { notFound } from "next/navigation";
import { readDb } from "@/lib/store";
import { landingKeys, type LandingKey } from "@/lib/types";
import { landingMeta, landingPath } from "@/lib/landings";
import { getService } from "@/lib/services";
import { LandingForm } from "@/components/admin/LandingForm";

export const metadata = { title: "Edit landing page" };

export default async function EditLanding({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!(landingKeys as readonly string[]).includes(key)) notFound();
  const k = key as LandingKey;
  const { landings, projects } = await readDb();
  const { updatedAt: _u, ...initial } = landings[k];
  const serviceKey = landingMeta[k].serviceKey;
  return (
    <LandingForm
      initial={initial}
      label={landingMeta[k].label.nl}
      viewUrl={landingPath("nl", k)}
      portfolioInfo={{
        category: getService(serviceKey)?.title.en || serviceKey,
        count: projects.filter((p) => p.published && p.category === serviceKey).length,
      }}
    />
  );
}
