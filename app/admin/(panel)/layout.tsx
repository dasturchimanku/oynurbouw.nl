import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="lg:flex">
      <aside className="sticky top-0 z-30 border-b border-line bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-6 lg:py-7">
          <Link href="/admin">
            <Image src="/brand/logo.png" alt="Oynur Bouw" width={170} height={34} className="h-7 w-auto" />
          </Link>
          <form action={logout} className="lg:hidden">
            <button className="grid size-9 place-items-center rounded-lg text-stone hover:bg-sand hover:text-ink" aria-label="Log out">
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
        <div className="px-3 pb-3 lg:flex-1 lg:px-4">
          <AdminNav />
        </div>
        <div className="hidden space-y-1 border-t border-line p-4 lg:block">
          <a href="/nl" target="_blank" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-stone hover:bg-sand hover:text-ink">
            <ExternalLink className="size-[18px]" /> View website
          </a>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-stone hover:bg-sand hover:text-ink">
              <LogOut className="size-[18px]" /> Log out
            </button>
          </form>
          <p className="truncate px-3.5 pt-2 text-xs text-stone/70">{String(session.sub)}</p>
        </div>
      </aside>
      <div className="min-w-0 flex-1 lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
