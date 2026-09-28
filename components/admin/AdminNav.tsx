"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, LayoutDashboard, PanelsTopLeft, Settings } from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Portfolio", icon: FolderKanban },
  { href: "/admin/landings", label: "Landing pages", icon: PanelsTopLeft },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map((it) => {
        const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
              active ? "bg-brand-50 text-brand" : "text-stone hover:bg-sand hover:text-ink"
            }`}
          >
            <it.icon className="size-[18px]" />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
