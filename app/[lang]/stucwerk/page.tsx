import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { LandingView, landingMetadata } from "@/components/site/LandingView";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return landingMetadata((await params).lang, "stucwerk");
}

export default async function Page({ params }: Props) {
  return <LandingView lang={(await params).lang} landingKey="stucwerk" />;
}
