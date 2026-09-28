"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authConfigured, checkCredentials, createSession, rateLimit } from "@/lib/auth";

export async function login(_prev: { error?: string; email?: string }, formData: FormData): Promise<{ error?: string; email?: string }> {
  if (!authConfigured()) return { error: "Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET in .env.local" };
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (!rateLimit(`login:${ip}`, 8, 15 * 60 * 1000)) return { error: "Too many attempts. Try again in 15 minutes.", email: String(formData.get("email") || "") };
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  if (!checkCredentials(email, password)) {
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Incorrect email or password.", email };
  }
  await createSession(email);
  redirect("/admin");
}
