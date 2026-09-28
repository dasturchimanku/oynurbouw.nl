import type { Settings, SocialKey } from "@/lib/types";
import { socialKeys } from "@/lib/types";
import { socialMeta } from "@/lib/socials";
import { SocialIcon } from "@/components/SocialIcon";

export function activeSocials(settings: Settings) {
  return socialKeys
    .filter((k) => /^https?:\/\//.test(settings.socials[k] || ""))
    .map((k) => ({ key: k as SocialKey, url: settings.socials[k], label: socialMeta[k].label }));
}

export function SocialLinks({ settings, size = "md" }: { settings: Settings; size?: "md" | "lg" }) {
  const items = activeSocials(settings);
  if (!items.length) return null;
  const dim = size === "lg" ? "size-12" : "size-10";
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s.key}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={`${s.label} – Oynur Bouw`}
            title={s.label}
            className={`${dim} inline-flex items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-brand hover:bg-brand hover:text-white`}
          >
            <SocialIcon name={s.key} className={size === "lg" ? "size-5" : "size-[18px]"} />
          </a>
        </li>
      ))}
    </ul>
  );
}
