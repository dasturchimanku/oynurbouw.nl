"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.email} key={state.email} className="field !py-3" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus={!!state.error} className="field !py-3" />
      </div>
      {state.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{state.error}</p>}
      <button className="btn-primary w-full !py-3.5" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />} Log in
      </button>
    </form>
  );
}
