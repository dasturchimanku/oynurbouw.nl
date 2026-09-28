import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/archivo/wdth.css";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin | Oynur Bouw", template: "%s | Admin Oynur Bouw" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#15120f" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-[#f5f2ee]">{children}</body>
    </html>
  );
}
