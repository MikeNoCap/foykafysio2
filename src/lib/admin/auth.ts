/**
 * Auth for /admin: one shared password (scrypt hash in env) and a signed, short-lived session cookie.
 * No database, no dependencies. Fails closed: without both env vars nobody can log in.
 *
 *   ADMIN_PASSWORD_HASH   = scrypt:<salt hex>:<hash hex>   (generate with `npm run admin:password`)
 *   ADMIN_SESSION_SECRET  = at least 32 random characters
 */
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";

const COOKIE = "ff_admin";
const SESSION_SECONDS = 60 * 60 * 8;

const passwordHash = () => process.env.ADMIN_PASSWORD_HASH ?? "";
const sessionSecret = () => process.env.ADMIN_SESSION_SECRET ?? "";

export const isAdminConfigured = () =>
  /^scrypt:[0-9a-f]{32,}:[0-9a-f]{128}$/.test(passwordHash()) && sessionSecret().length >= 32;

const safeEqual = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);

export function verifyPassword(password: string) {
  if (!isAdminConfigured() || !password || password.length > 200) return false;
  const [, salt, hash] = passwordHash().split(":");
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, Buffer.from(salt, "hex"), expected.length);
  return safeEqual(actual, expected);
}

/** The password hash is part of the signing key, so changing the password logs everyone out. */
const sign = (payload: string) =>
  createHmac("sha256", `${sessionSecret()}:${passwordHash()}`).update(payload).digest();

export async function createSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(expires);
  (await cookies()).set(COOKIE, `${payload}.${sign(payload).toString("hex")}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).set(COOKIE, "", { path: "/admin", maxAge: 0 });
}

/** Call at the top of the admin page AND of every admin Server Action. */
export async function isAuthenticated() {
  if (!isAdminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value ?? "";
  const [payload, signature, ...rest] = value.split(".");
  if (!payload || !signature || rest.length || !/^\d+$/.test(payload) || !/^[0-9a-f]{64}$/.test(signature))
    return false;
  if (!safeEqual(Buffer.from(signature, "hex"), sign(payload))) return false;
  return Number(payload) > Date.now() / 1000;
}

/* --- Login throttling (in memory: the site runs as a single Node process) --- */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 5;
/** Backstop in case X-Forwarded-For is spoofed to dodge the per-IP limit. */
const MAX_GLOBAL = 40;
const failures = new Map<string, number[]>();

const recent = (key: string) => {
  const list = (failures.get(key) ?? []).filter((t) => t > Date.now() - WINDOW_MS);
  if (list.length) failures.set(key, list);
  else failures.delete(key);
  return list;
};

export async function clientKey() {
  const h = await headers();
  return `ip:${h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"}`;
}

export const isLockedOut = (key: string) =>
  recent(key).length >= MAX_PER_IP || recent("global").length >= MAX_GLOBAL;

export function recordFailure(key: string) {
  for (const k of [key, "global"]) failures.set(k, [...recent(k), Date.now()]);
  // Bound memory under a flood of spoofed IPs, but never forget the global counter.
  if (failures.size > 5000) for (const k of failures.keys()) if (k !== "global") failures.delete(k);
}

export const clearFailures = (key: string) => failures.delete(key);
