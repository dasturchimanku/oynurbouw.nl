import type { SocialKey } from "./types";

export const socialMeta: Record<SocialKey, { label: string; placeholder: string }> = {
  instagram: { label: "Instagram", placeholder: "https://www.instagram.com/…" },
  tiktok: { label: "TikTok", placeholder: "https://www.tiktok.com/@…" },
  facebook: { label: "Facebook", placeholder: "https://www.facebook.com/…" },
  linkedin: { label: "LinkedIn", placeholder: "https://www.linkedin.com/company/…" },
  youtube: { label: "YouTube", placeholder: "https://www.youtube.com/@…" },
  pinterest: { label: "Pinterest", placeholder: "https://www.pinterest.com/…" },
  x: { label: "X (Twitter)", placeholder: "https://x.com/…" },
  google: { label: "Google Bedrijfsprofiel", placeholder: "https://g.page/…" },
  werkspot: { label: "Werkspot", placeholder: "https://www.werkspot.nl/profiel/…" },
};
