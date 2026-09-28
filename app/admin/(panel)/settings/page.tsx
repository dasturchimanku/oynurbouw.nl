import { getSettings } from "@/lib/store";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { updatedAt: _u, ...settings } = await getSettings();
  return (
    <>
      <PageHeader title="Settings" text="Company details, social media and website photos." />
      <SettingsForm initial={settings} />
    </>
  );
}
