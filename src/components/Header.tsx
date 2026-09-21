"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingButton } from "@/components/BookingButton";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Calendar, Close, Menu, Phone, Pin } from "@/components/Icons";
import { EVENTS, track } from "@/lib/analytics";
import { clinic, mainNav } from "@/lib/site";

/** On Hege's funnel pages the header CTA books her directly; elsewhere it opens the booking hub. */
const FUNNEL_PATHS = ["/osteopati", "/ultralyd"];

export function Header() {
  const pathname = usePathname();
  // Menu is "open at a path", so it closes by itself on navigation.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (v: boolean) => setOpenAt(v ? pathname : null);
  const inFunnel = FUNNEL_PATHS.includes(pathname);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = () => {
    track(EVENTS.TOGGLED_MOBILE_MENU, { open: !open });
    setOpen(!open);
  };

  const cta = (location: string, className = "") =>
    inFunnel ? (
      <BookingButton location={location} label="Bestill time" className={className} />
    ) : (
      <TrackedLink
        href="/bestill-time"
        event={EVENTS.CLICKED_CTA}
        eventProps={{ cta: "bestill_time", location }}
        className={`btn btn-book ${className}`}
      >
        <Calendar />
        Bestill time
      </TrackedLink>
    );

  return (
    <header className="sticky top-0 z-40 border-b border-mint-200/70 bg-white/90 backdrop-blur-md">
      <div className="hidden bg-secondary text-sm text-white/90 md:block on-dark">
        <div className="container-page flex items-center justify-between py-1.5">
          <p className="flex items-center gap-1.5">
            <Pin width={16} height={16} /> {clinic.street}, {clinic.postalCode} {clinic.city} · Driftsavtale med Asker kommune
          </p>
          <TrackedLink
            href={clinic.phoneHref}
            event={EVENTS.CLICKED_PHONE}
            eventProps={{ location: "topbar", therapist: "clinic" }}
            className="flex items-center gap-1.5 font-semibold hover:underline"
          >
            <Phone width={16} height={16} /> {clinic.phone}
          </TrackedLink>
        </div>
      </div>

      <div className="container-page flex items-center justify-between gap-4 py-2.5">
        <Link href="/" aria-label={`${clinic.name} – til forsiden`} className="shrink-0">
          <Image
            src="/logo/logo-horizontal.svg"
            alt={clinic.name}
            width={154}
            height={96}
            priority
            className="h-16 w-auto sm:h-[4.5rem]"
          />
        </Link>

        <nav aria-label="Hovedmeny" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <TrackedLink
                  href={item.href}
                  event={EVENTS.CLICKED_NAV}
                  eventProps={{ label: item.label, location: "header" }}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="rounded-full px-3.5 py-2 font-display font-semibold text-secondary transition hover:bg-mint-100 aria-[current=page]:bg-mint-100"
                >
                  {item.label}
                </TrackedLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {cta("header", "min-h-11 px-4 text-sm sm:min-h-12 sm:px-6 sm:text-base")}
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex size-12 items-center justify-center rounded-full bg-mint-100 text-secondary lg:hidden"
          >
            <span className="sr-only">{open ? "Lukk meny" : "Åpne meny"}</span>
            {open ? <Close width={24} height={24} /> : <Menu width={24} height={24} />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="border-t border-mint-200 bg-white lg:hidden">
        <nav aria-label="Mobilmeny" className="container-page py-4">
          <ul className="grid gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <TrackedLink
                  href={item.href}
                  event={EVENTS.CLICKED_NAV}
                  eventProps={{ label: item.label, location: "mobile_menu" }}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 font-display text-lg font-semibold text-secondary hover:bg-mint-100"
                >
                  {item.label}
                </TrackedLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-3">
            {cta("mobile_menu", "w-full")}
            <TrackedLink
              href={clinic.phoneHref}
              event={EVENTS.CLICKED_PHONE}
              eventProps={{ location: "mobile_menu", therapist: "clinic" }}
              className="btn btn-outline w-full"
            >
              <Phone /> Ring {clinic.phone}
            </TrackedLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
