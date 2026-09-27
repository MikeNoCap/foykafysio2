"use client";

import { useEffect, useRef, useState } from "react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { ArrowRight, Calendar, External } from "@/components/Icons";
import { EVENTS, track, trackFunnelStep } from "@/lib/analytics";
import { HAS_ONLINE_BOOKING, HEGE_BOOKING_HREF } from "@/lib/site";
import { EmailText } from "@/components/ContactText";

/**
 * The two ways to book, always offered together so requests for the municipal
 * physiotherapists never end up in Hege's (private) booking system, and vice versa.
 */
export function BookingOptions({
  location,
  clinicEmail,
  privateFirst = false,
  onNavigate,
}: {
  location: string;
  clinicEmail: string;
  privateFirst?: boolean;
  onNavigate?: () => void;
}) {
  const row =
    "group flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left transition";
  const municipal = (
    <li key="kommunal">
      <TrackedLink
        href="/bestill-time#fysioterapi"
        event={EVENTS.CLICKED_BOOKING_FYSIOTERAPI}
        eventProps={{ location }}
        onClick={onNavigate}
        className={`${row} bg-mint-100 hover:bg-mint-200`}
      >
        <span>
          <span className="block font-display text-lg font-bold leading-tight text-secondary">Fysioterapi – kommunal avtale</span>
          <span className="block text-[0.9rem] text-ink">Kontakt klinikken: <EmailText>{clinicEmail}</EmailText></span>
        </span>
        <ArrowRight className="shrink-0 text-secondary transition group-hover:translate-x-1" />
      </TrackedLink>
    </li>
  );
  const privat = (
    <li key="privat">
      <TrackedLink
        href={HEGE_BOOKING_HREF}
        event={EVENTS.CLICKED_BOOKING_OSTEOPATI}
        eventProps={{
          location,
          service: "osteopati",
          label: "Osteopat Hege Wang – privat tilbud",
          destination: HAS_ONLINE_BOOKING ? "online_booking" : "booking_page",
        }}
        onTracked={() => {
          if (HAS_ONLINE_BOOKING) trackFunnelStep("booking_clicked", { location, service: "osteopati" });
        }}
        onClick={onNavigate}
        className={`${row} bg-secondary hover:bg-ink`}
      >
        <span>
          <span className="block font-display text-lg font-bold leading-tight text-white">Osteopat Hege Wang – privat tilbud</span>
          <span className="block text-[0.9rem] text-white/80">Time raskt · bestill på nett</span>
        </span>
        {HAS_ONLINE_BOOKING ? (
          <External className="shrink-0 text-primary" />
        ) : (
          <ArrowRight className="shrink-0 text-primary transition group-hover:translate-x-1" />
        )}
      </TrackedLink>
    </li>
  );
  return <ul className="grid gap-2">{privateFirst ? [privat, municipal] : [municipal, privat]}</ul>;
}

/** Header "Bestill time" button: opens the two booking choices instead of going straight to one of them. */
export function BookingMenu({
  clinicEmail,
  privateFirst,
  className = "",
}: {
  clinicEmail: string;
  privateFirst?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={ref} className="sm:relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="booking-menu"
        onClick={() => {
          if (!open) track(EVENTS.CLICKED_CTA, { cta: "bestill_time", location: "header" });
          setOpen(!open);
        }}
        className={`btn btn-book ${className}`}
      >
        {/* No room for the icon next to the logo and menu button on the narrowest phones */}
        <Calendar className="max-[359px]:hidden" />
        Bestill time
      </button>
      <div
        id="booking-menu"
        hidden={!open}
        // On phones the panel is positioned against the sticky header, so it spans the screen width.
        className="absolute inset-x-4 top-full z-50 mt-2 rounded-[1.75rem] bg-white p-3 shadow-soft ring-1 ring-mint-200 sm:inset-x-auto sm:right-0 sm:w-[22rem]"
      >
        <p className="px-2 pt-1 pb-2.5 font-display font-bold text-secondary">Hvem vil du bestille time hos?</p>
        <BookingOptions location="header_menu" clinicEmail={clinicEmail} privateFirst={privateFirst} onNavigate={() => setOpen(false)} />
      </div>
    </div>
  );
}
