"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingMenu, BookingOptions } from "@/components/BookingMenu";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Close, Menu, Phone, Pin } from "@/components/Icons";
import { EVENTS, track } from "@/lib/analytics";
import { clinic as staticClinic, mainNav } from "@/lib/site";
import { PhoneText } from "@/components/ContactText";

/** On Hege's funnel pages the private option is listed first in the booking choices. */
const FUNNEL_PATHS = ["/osteopati", "/ultralyd"];

/** `phone`/`phoneHref`/`email` come from the layout because they are editable in /admin (see lib/content.ts). */
export function Header({ phone, phoneHref, email }: { phone: string; phoneHref: string; email: string }) {
  const clinic = { ...staticClinic, phone, phoneHref, email };
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

  return (
    <header className="sticky top-0 z-40 border-b border-mint-200/70 bg-white/90 backdrop-blur-md">
      <div className="hidden bg-secondary text-sm text-white/90 md:block on-dark">
        <div className="container-page flex items-center justify-between py-1.5">
          <p className="flex items-center gap-1.5">
            <Pin width={16} height={16} /> {clinic.street}, {clinic.postalCode} {clinic.city} · Fysioterapi med kommunal driftsavtale · Privat osteopat
          </p>
          <TrackedLink
            href={clinic.phoneHref}
            event={EVENTS.CLICKED_PHONE}
            eventProps={{ location: "topbar", therapist: "clinic" }}
            className="flex items-center gap-1.5 font-semibold hover:underline"
          >
            <Phone width={16} height={16} /> <PhoneText>{clinic.phone}</PhoneText>
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
          <BookingMenu clinicEmail={clinic.email} privateFirst={inFunnel} className="min-h-11 px-3.5 text-sm whitespace-nowrap min-[360px]:px-4 sm:min-h-12 sm:px-6 sm:text-base" />
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
            <p className="font-display font-bold text-secondary">Bestill time</p>
            <BookingOptions location="mobile_menu" clinicEmail={clinic.email} privateFirst={inFunnel} onNavigate={() => setOpen(false)} />
            <TrackedLink
              href={clinic.phoneHref}
              event={EVENTS.CLICKED_PHONE}
              eventProps={{ location: "mobile_menu", therapist: "clinic" }}
              className="btn btn-outline w-full"
            >
              <Phone className="shrink-0" />
              <span>Ring <PhoneText>{clinic.phone}</PhoneText></span>
            </TrackedLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
