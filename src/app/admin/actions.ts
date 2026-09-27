"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearFailures,
  clientKey,
  createSession,
  destroySession,
  isAdminConfigured,
  isAuthenticated,
  isLockedOut,
  recordFailure,
  verifyPassword,
} from "@/lib/admin/auth";
import { parseContent, writeEditableContent } from "@/lib/content";

export type LoginState = { error?: string };
export type SaveState = { ok: boolean; errors: string[] };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) return { error: "Innlogging er ikke satt opp på serveren." };
  const key = await clientKey();
  if (isLockedOut(key)) return { error: "For mange forsøk. Vent 15 minutter og prøv igjen." };

  const password = formData.get("password");
  if (typeof password !== "string" || !verifyPassword(password)) {
    recordFailure(key);
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Feil passord." };
  }
  clearFailures(key);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin");
}

export async function saveContent(input: unknown): Promise<SaveState> {
  // Server Actions are public endpoints: never rely on the page having checked the session.
  if (!(await isAuthenticated())) return { ok: false, errors: ["Du er logget ut. Last siden på nytt og logg inn igjen."] };

  const { content, errors } = parseContent(input);
  if (errors.length) return { ok: false, errors };

  try {
    writeEditableContent(content);
  } catch (err) {
    console.error("[admin] Could not write content file:", err);
    return { ok: false, errors: ["Kunne ikke lagre på serveren. Ta kontakt med Mikkel."] };
  }
  // Every page shows prices or contact info, so rebuild them all.
  revalidatePath("/", "layout");
  return { ok: true, errors: [] };
}
