"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initial: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);
  return (
    <form action={action} className="card mt-6 grid gap-4">
      <label className="grid gap-1.5 font-semibold text-secondary">
        Passord
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="admin-input"
        />
      </label>
      {state.error && <p role="alert" className="font-semibold text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-dark disabled:opacity-60">
        {pending ? "Logger inn …" : "Logg inn"}
      </button>
    </form>
  );
}
