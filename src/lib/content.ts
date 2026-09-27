/**
 * Editable content layer. The clinic edits a small subset of the facts in `site.ts`
 * (prices, contact info, a notice banner) from /admin. Edits are stored as one JSON
 * file on disk and merged over the defaults from `site.ts`.
 *
 * Server-only (uses node:fs). Client components get these values as props.
 */
import fs from "node:fs";
import path from "node:path";
import {
  clinic as defaultClinic,
  formatPrice,
  phoneToHref,
  prices as defaultPrices,
  therapists as defaultTherapists,
  type Price,
  type Therapist,
} from "@/lib/site";

export type Notice = { enabled: boolean; text: string };

/** Exactly what is stored in the JSON file. Everything else lives in site.ts. */
export type EditableContent = {
  notice: Notice;
  clinic: { phone: string; email: string; addressNote: string };
  therapists: Record<string, { title: string; phone: string; email: string }>;
  prices: Price[];
  updatedAt?: string;
};

/** Must survive deploys: keep it outside the build output (and on a volume if you use Docker). */
export const CONTENT_FILE = path.resolve(
  /*turbopackIgnore: true*/ process.env.CONTENT_FILE || path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "content.json"),
);

export const PRICE_GROUPS: Price["group"][] = ["osteopati", "ultralyd"];

export const defaultContent: EditableContent = {
  notice: { enabled: false, text: "" },
  clinic: {
    phone: defaultClinic.phone,
    email: defaultClinic.email,
    addressNote: defaultClinic.addressNote,
  },
  therapists: Object.fromEntries(
    defaultTherapists.map((t) => [t.id, { title: t.title, phone: t.phone, email: t.email }]),
  ),
  prices: defaultPrices,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d ]{8,16}$/;

const text = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";

/**
 * Validates untrusted input (the admin form or the file on disk) into a clean EditableContent.
 * Returns a list of human-readable (Norwegian) errors instead of throwing.
 */
export function parseContent(input: unknown): { content: EditableContent; errors: string[] } {
  const errors: string[] = [];
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const obj = (v: unknown) => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});

  const n = obj(src.notice);
  const notice: Notice = { enabled: n.enabled === true, text: text(n.text, 300) };
  if (notice.enabled && !notice.text) errors.push("Driftsmeldingen er slått på, men mangler tekst.");

  const c = obj(src.clinic);
  const clinic = {
    phone: text(c.phone, 20),
    email: text(c.email, 100),
    addressNote: text(c.addressNote, 120),
  };
  if (!PHONE_RE.test(clinic.phone)) errors.push("Klinikkens telefonnummer er ugyldig.");
  if (!EMAIL_RE.test(clinic.email)) errors.push("Klinikkens e-postadresse er ugyldig.");

  const ts = obj(src.therapists);
  const therapists: EditableContent["therapists"] = {};
  for (const d of defaultTherapists) {
    const t = obj(ts[d.id]);
    const entry = { title: text(t.title, 80), phone: text(t.phone, 20), email: text(t.email, 100) };
    if (!entry.title) errors.push(`${d.name}: tittel mangler.`);
    if (!PHONE_RE.test(entry.phone)) errors.push(`${d.name}: telefonnummeret er ugyldig.`);
    if (!EMAIL_RE.test(entry.email)) errors.push(`${d.name}: e-postadressen er ugyldig.`);
    therapists[d.id] = entry;
  }

  const prices: Price[] = [];
  const seen = new Set<string>();
  const rawPrices = Array.isArray(src.prices) ? src.prices.slice(0, 30) : [];
  rawPrices.forEach((raw, i) => {
    const p = obj(raw);
    const label = text(p.label, 80);
    const price = typeof p.price === "number" ? p.price : Number(text(p.price, 10));
    const group = PRICE_GROUPS.find((g) => g === p.group);
    let id = text(p.id, 40).replace(/[^a-z0-9-]/gi, "").toLowerCase();
    if (!id || seen.has(id)) id = `pris-${i + 1}-${Date.now().toString(36)}`;
    seen.add(id);
    if (!label) errors.push(`Prisrad ${i + 1}: navn mangler.`);
    if (!Number.isInteger(price) || price < 0 || price > 100000)
      errors.push(`Prisrad ${i + 1}: prisen må være et helt tall mellom 0 og 100 000.`);
    if (!group) errors.push(`Prisrad ${i + 1}: ugyldig gruppe.`);
    const detail = text(p.detail, 120);
    prices.push({ id, label, ...(detail ? { detail } : {}), price, group: group ?? "osteopati" });
  });
  if (prices.length === 0) errors.push("Prislisten kan ikke være tom.");

  return { content: { notice, clinic, therapists, prices }, errors };
}

// The turbopackIgnore comments stop the bundler from tracing the whole project because of a runtime path.
let cache: { mtimeMs: number; content: EditableContent } | null = null;

/** Reads the stored edits. Falls back to the defaults if the file is missing or invalid. */
export function readEditableContent(): EditableContent {
  try {
    const { mtimeMs } = fs.statSync(/*turbopackIgnore: true*/ CONTENT_FILE);
    if (cache?.mtimeMs === mtimeMs) return cache.content;
    const raw = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ CONTENT_FILE, "utf8"));
    const { content, errors } = parseContent(raw);
    if (errors.length) {
      console.error(`[content] ${CONTENT_FILE} is invalid, using defaults:`, errors);
      return defaultContent;
    }
    content.updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : undefined;
    cache = { mtimeMs, content };
    return content;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT")
      console.error(`[content] Could not read ${CONTENT_FILE}, using defaults:`, err);
    return defaultContent;
  }
}

/** Atomic write (temp file + rename) so a crash can never leave a half-written file. Keeps one backup. */
export function writeEditableContent(content: EditableContent) {
  fs.mkdirSync(/*turbopackIgnore: true*/ path.dirname(CONTENT_FILE), { recursive: true });
  if (fs.existsSync(/*turbopackIgnore: true*/ CONTENT_FILE)) fs.copyFileSync(/*turbopackIgnore: true*/ CONTENT_FILE, `${CONTENT_FILE}.bak`);
  const tmp = `${CONTENT_FILE}.${process.pid}.tmp`;
  const data = { ...content, updatedAt: new Date().toISOString() };
  fs.writeFileSync(/*turbopackIgnore: true*/ tmp, JSON.stringify(data, null, 2), { mode: 0o600 });
  fs.renameSync(/*turbopackIgnore: true*/ tmp, CONTENT_FILE);
  cache = null;
}

/** "Konsultasjon (Undersøkelse og behandling) 1200,-, Behandling …" for FAQ answers and similar prose. */
export const priceSummary = (prices: Price[]) =>
  prices.map((p) => `${p.label}${p.detail ? ` (${p.detail.toLowerCase()})` : ""} ${formatPrice(p.price)}`).join(", ");

/** What pages and components render: site.ts defaults with the stored edits applied. */
export function getContent() {
  const edits = readEditableContent();
  const clinic = {
    ...defaultClinic,
    ...edits.clinic,
    phoneHref: phoneToHref(edits.clinic.phone),
  };
  const therapists: Therapist[] = defaultTherapists.map((t) => {
    const e = edits.therapists[t.id];
    return e ? { ...t, ...e, phoneHref: phoneToHref(e.phone) } : t;
  });
  const prices = edits.prices;
  return {
    clinic,
    therapists,
    hege: therapists[0],
    prices,
    priceOf: (id: string) => prices.find((p) => p.id === id)?.price,
    notice: edits.notice,
  };
}
