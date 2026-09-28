import { Phone } from "lucide-react";
import { SocialIcon } from "@/components/SocialIcon";

/** Mobile: fixed bottom bar with WhatsApp + Call. Desktop: floating WhatsApp button. */
export function ActionBar({
  whatsappHref,
  phoneHref,
  labels,
}: {
  whatsappHref: string;
  phoneHref: string;
  labels: { whatsapp: string; call: string };
}) {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <div className="flex gap-2.5">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-full bg-[#25D366] text-[15px] font-semibold text-white active:scale-[0.98]"
          >
            <SocialIcon name="whatsapp" className="size-5" /> {labels.whatsapp}
          </a>
          {phoneHref && (
            <a
              href={phoneHref}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line text-[15px] font-semibold text-ink active:scale-[0.98]"
            >
              <Phone className="size-4" /> {labels.call}
            </a>
          )}
        </div>
      </div>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.whatsapp}
        title={labels.whatsapp}
        className="fixed right-6 bottom-6 z-40 hidden size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105 lg:grid"
      >
        <SocialIcon name="whatsapp" className="size-7" />
      </a>
    </>
  );
}
