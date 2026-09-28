import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "@fontsource-variable/inter";
import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 – Pagina niet gevonden | Oynur Bouw",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="nl">
      <body className="bg-paper text-ink">
        <main className="relative flex min-h-dvh items-center overflow-hidden">
                    <div className="container-x relative py-20">
            <Link href="/nl" aria-label="Oynur Bouw B.V.">
              <Image src="/brand/logo.png" alt="Oynur Bouw B.V." width={220} height={44} className="h-9 w-auto" />
            </Link>
            <p className="mt-16 font-display text-[7rem] leading-none font-extrabold text-brand sm:text-[10rem]">404</p>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Pagina niet gevonden</h1>
            <p className="mt-2 text-lg text-stone">Page not found</p>
            <p className="mt-6 max-w-lg text-stone">
              De pagina die u zoekt bestaat niet (meer). / The page you are looking for does not exist.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/nl" className="btn-primary">
                Naar de homepage
              </Link>
              <Link href="/nl/projecten" className="btn-ghost">
                Projecten
              </Link>
              <Link href="/nl/contact" className="btn-ghost">
                Contact
              </Link>
              <Link href="/en" className="btn-ghost">
                English
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
