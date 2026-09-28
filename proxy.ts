import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const LOCALES = ["nl", "en"];
const SESSION_COOKIE = "ob_admin";

function preferredLocale(req: NextRequest) {
  const header = req.headers.get("accept-language") || "";
  const langs = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of langs) if (LOCALES.includes(lang)) return lang;
  return "nl";
}

async function isAdmin(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin area: optimistic auth check (pages & actions verify again on the server).
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (!(await isAdmin(req))) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const first = pathname.split("/")[1];
  if (LOCALES.includes(first)) return NextResponse.next();

  // Everything else gets a language prefix.
  const url = req.nextUrl.clone();
  const locale = pathname === "/" ? preferredLocale(req) : "nl";
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, pathname === "/" ? 307 : 308);
}

export const config = {
  matcher: [
    "/((?!api|_next|media|brand|favicon\\.ico|icon\\.png|apple-icon\\.png|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|opengraph-image|twitter-image|.*\\.[a-zA-Z0-9]{2,5}$).*)",
  ],
};
