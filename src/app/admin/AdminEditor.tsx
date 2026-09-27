"use client";

import { useState, useTransition } from "react";
import { saveContent, type SaveState } from "./actions";
import type { EditableContent } from "@/lib/content";
import type { Price } from "@/lib/site";

const GROUP_LABELS: Record<Price["group"], string> = { osteopati: "Osteopati", ultralyd: "Ultralyd" };

function Field({
  label,
  className = "",
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`grid gap-1.5 text-sm font-semibold text-secondary ${className}`}>
      {label}
      <input {...props} className="admin-input" />
    </label>
  );
}

export function AdminEditor({
  initial,
  therapistNames,
}: {
  initial: EditableContent;
  therapistNames: Record<string, string>;
}) {
  const [content, setContent] = useState(initial);
  const [result, setResult] = useState<SaveState | null>(null);
  const [pending, startTransition] = useTransition();

  const update = (patch: Partial<EditableContent>) => {
    setResult(null);
    setContent((c) => ({ ...c, ...patch }));
  };
  const setPrice = (i: number, patch: Partial<Price>) =>
    update({ prices: content.prices.map((p, j) => (j === i ? { ...p, ...patch } : p)) });
  const setTherapist = (id: string, patch: Partial<EditableContent["therapists"][string]>) =>
    update({ therapists: { ...content.therapists, [id]: { ...content.therapists[id], ...patch } } });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => setResult(await saveContent(content)));
  };

  return (
    <form onSubmit={save} className="mt-8 grid gap-6">
      <fieldset className="card grid gap-4">
        <legend className="float-left font-display text-xl font-extrabold text-secondary">Driftsmelding</legend>
        <p className="clear-both text-[0.95rem]">
          En stripe øverst på alle sider. Bruk den til ferieavvikling, stengte dager og lignende.
        </p>
        <label className="flex items-center gap-3 font-semibold text-secondary">
          <input
            type="checkbox"
            checked={content.notice.enabled}
            onChange={(e) => update({ notice: { ...content.notice, enabled: e.target.checked } })}
            className="size-5 accent-[var(--color-primary-dark)]"
          />
          Vis driftsmelding
        </label>
        <Field
          label="Tekst"
          value={content.notice.text}
          maxLength={300}
          placeholder="F.eks. «Klinikken holder stengt i uke 29 og 30.»"
          onChange={(e) => update({ notice: { ...content.notice, text: e.target.value } })}
        />
      </fieldset>

      <fieldset className="card grid gap-4">
        <legend className="float-left font-display text-xl font-extrabold text-secondary">Priser (privat)</legend>
        <ul className="clear-both grid gap-4">
          {content.prices.map((p, i) => (
            <li key={p.id} className="grid gap-3 rounded-2xl bg-mint-50 p-4 sm:grid-cols-[1.4fr_1.4fr_0.8fr_1fr_auto] sm:items-end">
              <Field label="Navn" value={p.label} required maxLength={80} onChange={(e) => setPrice(i, { label: e.target.value })} />
              <Field label="Detalj" value={p.detail ?? ""} maxLength={120} onChange={(e) => setPrice(i, { detail: e.target.value })} />
              <Field
                label="Pris (kr)"
                type="number"
                inputMode="numeric"
                min={0}
                max={100000}
                step={1}
                required
                value={Number.isFinite(p.price) ? p.price : ""}
                onChange={(e) => setPrice(i, { price: e.target.value === "" ? NaN : Number(e.target.value) })}
              />
              <label className="grid gap-1.5 text-sm font-semibold text-secondary">
                Gruppe
                <select value={p.group} onChange={(e) => setPrice(i, { group: e.target.value as Price["group"] })} className="admin-input">
                  {Object.entries(GROUP_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => update({ prices: content.prices.filter((_, j) => j !== i) })}
                aria-label={`Fjern ${p.label || "prisrad"}`}
                className="min-h-11 rounded-full px-4 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                Fjern
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            update({ prices: [...content.prices, { id: `pris-${Date.now().toString(36)}`, label: "", price: NaN, group: "osteopati" }] })
          }
          className="btn btn-outline min-h-10 justify-self-start px-5 py-2 text-sm"
        >
          + Legg til pris
        </button>
      </fieldset>

      <fieldset className="card grid gap-4">
        <legend className="float-left font-display text-xl font-extrabold text-secondary">Kontaktinfo klinikken</legend>
        <div className="clear-both grid gap-4 sm:grid-cols-2">
          <Field label="Telefon" type="tel" required value={content.clinic.phone} onChange={(e) => update({ clinic: { ...content.clinic, phone: e.target.value } })} />
          <Field label="E-post" type="email" required value={content.clinic.email} onChange={(e) => update({ clinic: { ...content.clinic, email: e.target.value } })} />
          <Field label="Merknad til adressen" className="sm:col-span-2" maxLength={120} value={content.clinic.addressNote} onChange={(e) => update({ clinic: { ...content.clinic, addressNote: e.target.value } })} />
        </div>
      </fieldset>

      <fieldset className="card grid gap-5">
        <legend className="float-left font-display text-xl font-extrabold text-secondary">Behandlere</legend>
        {Object.entries(content.therapists).map(([id, t]) => (
          <div key={id} className="clear-both grid gap-3 sm:grid-cols-3">
            <h3 className="font-display text-lg font-bold text-secondary sm:col-span-3">{therapistNames[id] ?? id}</h3>
            <Field label="Tittel" required maxLength={80} value={t.title} onChange={(e) => setTherapist(id, { title: e.target.value })} />
            <Field label="Telefon" type="tel" required value={t.phone} onChange={(e) => setTherapist(id, { phone: e.target.value })} />
            <Field label="E-post" type="email" required value={t.email} onChange={(e) => setTherapist(id, { email: e.target.value })} />
          </div>
        ))}
      </fieldset>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-4 rounded-[2rem] bg-white p-4 shadow-soft">
        <button type="submit" disabled={pending} className="btn btn-dark disabled:opacity-60">
          {pending ? "Lagrer …" : "Lagre endringer"}
        </button>
        <div role="status" aria-live="polite" className="min-w-0 flex-1">
          {result?.ok && <p className="font-semibold text-ink">Lagret! Endringene er ute på nettsiden.</p>}
          {result && !result.ok && (
            <ul className="grid gap-1 font-semibold text-red-700">
              {result.errors.map((err) => <li key={err}>{err}</li>)}
            </ul>
          )}
        </div>
      </div>
    </form>
  );
}
