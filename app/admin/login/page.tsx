import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await getSession().catch(() => null)) redirect("/admin");
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper p-6">
      <div className="w-full max-w-sm">
        <Image src="/brand/logo.png" alt="Oynur Bouw B.V." width={220} height={44} className="mb-10 h-9 w-auto" priority />
        <h1 className="text-3xl font-extrabold">Log in</h1>
        <p className="mt-2 mb-8 text-stone">Sign in to manage your website.</p>
        <LoginForm />
      </div>
    </div>
  );
}
