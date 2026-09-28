"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import type { Locale } from "@/lib/types";
import { SocialIcon } from "@/components/SocialIcon";

type NavItem = { href: string; label: string };

type Props = {
  locale: Locale;
  nav: NavItem[];
  labels: { menu: string; close: string; whatsapp: string; call: string };
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  /** pairs of [nl, en] path segments/slugs used to translate the current URL */
  slugPairs: [string, string][];
};

function switchLocale(pathname: string, target: Locale, pairs: [string, string][]) {
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) return `/${target}`;
  const from = parts[0] === "en" ? 1 : 0;
  const to = target === "en" ? 1 : 0;
  const out = parts.slice(1).map((seg) => {
    const pair = pairs.find((p) => p[from] === seg);
    return pair ? pair[to] : seg;
  });
  return `/${[target, ...out].join("/")}`;
}

export function Header({ locale, nav, labels, phone, phoneHref, whatsappHref, slugPairs }: Props) {
  const pathname = usePathname() || `/${locale}`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const other: Locale = locale === "nl" ? "en" : "nl";
  const otherHref = switchLocale(pathname, other, slugPairs);
  const isHome = pathname === `/${locale}`;
  const isActive = (href: string) => (href === `/${locale}` ? isHome : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled || open ? "shadow-[0_1px_0_var(--color-line)]" : ""
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link href={`/${locale}`} className="shrink-0" aria-label="Oynur Bouw B.V. – home">
          <Image src="/brand/logo.png" alt="Oynur Bouw B.V." width={200} height={40} priority className="h-7 w-auto lg:h-8" />
        </Link>

        <nav aria-label={locale === "nl" ? "Hoofdmenu" : "Main menu"} className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-[15px] font-medium transition-colors xl:px-4 ${
                isActive(item.href) ? "text-brand" : "text-ink-700 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={otherHref}
            hrefLang={other}
            className="rounded-full px-3 py-2 text-xs font-bold tracking-wider text-stone uppercase hover:text-ink"
            aria-label={other === "en" ? "English version" : "Nederlandse versie"}
          >
            {other}
          </Link>
          {phone && (
            <a href={phoneHref} className="btn-ghost hidden !px-4 !py-2.5 xl:inline-flex">
              <Phone className="size-4" /> {phone}
            </a>
          )}
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary !px-5 !py-2.5">
            <SocialIcon name="whatsapp" className="size-4" /> {labels.whatsapp}
          </a>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <Link href={otherHref} hrefLang={other} className="px-2.5 py-2 text-xs font-bold tracking-wider text-stone uppercase">
            {other}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 grid size-11 place-items-center rounded-full"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? labels.close : labels.menu}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-white lg:hidden">
        <nav className="container-x flex flex-col pt-4 pb-32">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`border-b border-line py-4 font-display text-2xl font-bold ${isActive(item.href) ? "text-brand" : "text-ink"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
