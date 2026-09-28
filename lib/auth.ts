import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import crypto from "node:crypto";

export const SESSION_COOKIE = "ob_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET is missing or shorter than 32 characters. Set it in .env.local");
  }
  return new TextEncoder().encode(secret);
}

export function authConfigured() {
  return Boolean(
    process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && (process.env.AUTH_SECRET?.length ?? 0) >= 32,
  );
}

function safeEqual(a: string, b: string) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function checkCredentials(email: string, password: string) {
  if (!authConfigured()) return false;
  const okEmail = safeEqual(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase());
  const okPass = safeEqual(password, process.env.ADMIN_PASSWORD!);
  return okEmail && okPass;
}

export async function createSession(email: string) {
  const token = await new SignJWT({ sub: email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Secure cookies only work over https — on http://localhost or a LAN address they would break login.
    secure: (process.env.NEXT_PUBLIC_SITE_URL || "").startsWith("https://") && process.env.NODE_ENV === "production" && !process.env.ALLOW_INSECURE_COOKIE,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function verifyToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifyToken(token);
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/* Simple in-memory rate limiter (per process). */
const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  b.count++;
  return b.count <= limit;
}
