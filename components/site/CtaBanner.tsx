import type { Locale, Settings } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { telHref } from "@/lib/site";
import { waLink } from "@/lib/contact";
import { SocialIcon } from "@/components/SocialIcon";

export function CtaBanner({
  locale,
  settings,
  title,
  text,
  about,
  project,
}: {
  locale: Locale;
  settings: Settings;
  title?: string;
  text?: string;
  about?: string;
  project?: string;
}) {
  const t = getDictionary(locale);
  return (
    <section className="container-x py-16 lg:py-24">
      <div className="rounded-[2rem] bg-ink px-6 py-12 text-center text-white sm:px-12 lg:py-16">
        <h2 className="mx-auto max-w-2xl text-3xl leading-tight font-extrabold sm:text-4xl">{title || t.cta.title}</h2>
        <p className="mx-auto mt-4 max-w-lg text-white/70">{text || t.cta.text}</p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <a
            href={waLink(settings, locale, { about, project })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn h-14 w-full max-w-xs bg-[#25D366] text-base text-white hover:bg-[#1ebe5b]"
          >
            <SocialIcon name="whatsapp" className="size-5" /> {t.wa.button}
          </a>
          {settings.phone && (
            <a href={telHref(settings.phone)} className="text-sm text-white/70 hover:text-white">
              {t.cta.call} <span className="font-semibold text-white underline underline-offset-4">{settings.phone}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
