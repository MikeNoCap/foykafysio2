"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getConsent, setConsent, type Consent } from "@/lib/analytics";

const OPEN_EVENT = "ff:open-cookie-settings";
const CHANGE_EVENT = "ff:cookie-consent-changed";

const subscribe = (cb: () => void) => {
  window.addEventListener(CHANGE_EVENT, cb);
  return () => window.removeEventListener(CHANGE_EVENT, cb);
};

export function CookieConsent() {
  const [reopened, setReopened] = useState(false);
  const stored = useSyncExternalStore(
    subscribe,
    getConsent,
    () => "granted" as Consent | null, // never render the banner on the server
  );

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  if (stored !== null && !reopened) return null;

  const choose = (c: Consent) => {
    setConsent(c);
    setReopened(false);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <section
      aria-label="Informasjonskapsler"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-3xl border border-mint-200 bg-white p-5 shadow-soft sm:bottom-5 sm:left-5 sm:right-auto sm:mx-0"
    >
      <h2 className="font-display text-lg font-bold">Vi bryr oss om personvernet ditt</h2>
      <p className="mt-1 text-[0.95rem]">
        Vi bruker anonym statistikk for å forbedre nettsiden. Godtar du, lagrer vi også en
        informasjonskapsel slik at vi kjenner igjen besøket ditt neste gang.{" "}
        <Link href="/personvern" className="link">Les mer</Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => choose("granted")} className="btn btn-dark min-h-11 px-5 py-2">
          Godta
        </button>
        <button type="button" onClick={() => choose("denied")} className="btn btn-outline min-h-11 px-5 py-2">
          Kun nødvendige
        </button>
      </div>
    </section>
  );
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="cursor-pointer text-left underline-offset-4 hover:text-white hover:underline"
    >
      Informasjonskapsler
    </button>
  );
}
