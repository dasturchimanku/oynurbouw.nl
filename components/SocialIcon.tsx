import { socialIconPaths } from "@/lib/social-icon-paths";

export function SocialIcon({ name, className = "size-5" }: { name: string; className?: string }) {
  const d = socialIconPaths[name];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}
