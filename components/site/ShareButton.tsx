"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareButton({ title, label, copied }: { title: string; label: string; copied: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {}
  }
  return (
    <button type="button" onClick={share} aria-label={label} title={done ? copied : label} className="grid size-12 shrink-0 place-items-center rounded-full border border-line text-ink transition hover:border-ink/30">
      {done ? <Check className="size-5 text-green-600" /> : <Share2 className="size-5" />}
    </button>
  );
}
