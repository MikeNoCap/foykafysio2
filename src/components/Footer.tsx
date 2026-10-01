import Image from "next/image";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { CookieSettingsButton } from "@/components/CookieConsent";
import { EVENTS } from "@/lib/analytics";
import { getContent } from "@/lib/content";
import { services } from "@/lib/site";
import { EmailText, PhoneText } from "@/components/ContactText";

const pageLinks = [
  { label: "Hvem er vi", href: "/#hvem-er-vi" },
  { label: "Våre behandlere", href: "/#behandlerne" },
  { label: "Praktisk info", href: "/#praktisk-info" },
  { label: "Kontakt oss", href: "/#kontakt-oss" },
  { label: "Bestill time", href: "/bestill-time" },
  { label: "Personvern", href: "/personvern" },
];

export function Footer() {
  const { clinic } = getContent();
  const navLink = (label: string, href: string) => (
    <li key={href}>
      <TrackedLink
        href={href}
        event={EVENTS.CLICKED_NAV}
        eventProps={{ label, location: "footer" }}
        className="text-white/85 hover:text-white hover:underline"
      >
        {label}
      </TrackedLink>
    </li>
  );

  return (
    <footer className="on-dark relative mt-24 bg-secondary text-white">
      <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute -top-[59px] left-0 h-[60px] w-full fill-secondary">
        <path d="M0 80V40c180-45 380-45 620-10s520 45 820-15v65z" />
      </svg>
      <div className="container-page grid gap-10 pt-12 pb-10 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Image src="/logo/logo-vertical-light.svg" alt={clinic.name} width={150} height={163} className="h-36 w-auto" />
          <p className="mt-4 max-w-xs text-white/80">Fysikalsk institutt med driftsavtale med Asker kommune.</p>
        </div>
        <nav aria-label="Behandlinger">
          <h2 className="mb-3 font-display text-lg font-bold text-white">Behandlinger</h2>
          <ul className="grid gap-2">{services.map((s) => navLink(s.title, s.href))}</ul>
        </nav>
        <nav aria-label="Om klinikken">
          <h2 className="mb-3 font-display text-lg font-bold text-white">Klinikken</h2>
          <ul className="grid gap-2">{pageLinks.map((l) => navLink(l.label, l.href))}</ul>
        </nav>
        <div>
          <h2 className="mb-3 font-display text-lg font-bold text-white">Kontakt</h2>
          <address className="grid gap-2 not-italic text-white/85">
            <p>
              {clinic.street}, {clinic.postalCode} {clinic.city}
              {clinic.addressNote && (
                <>
                  <br />
                  <span className="text-sm text-white/70">{clinic.addressNote}</span>
                </>
              )}
            </p>
            <TrackedLink href={clinic.phoneHref} event={EVENTS.CLICKED_PHONE} eventProps={{ location: "footer", therapist: "clinic" }} className="font-semibold hover:underline">
              <PhoneText>{clinic.phone}</PhoneText>
            </TrackedLink>
            <TrackedLink href={`mailto:${clinic.email}`} event={EVENTS.CLICKED_EMAIL} eventProps={{ location: "footer", therapist: "clinic" }} className="font-semibold hover:underline">
              <EmailText>{clinic.email}</EmailText>
            </TrackedLink>
          </address>
          <TrackedLink href="/bestill-time" event={EVENTS.CLICKED_CTA} eventProps={{ cta: "bestill_time", location: "footer" }} className="btn btn-outline-light mt-5">
            Bestill time
          </TrackedLink>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-page flex flex-col gap-2 py-5 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {clinic.name}
            <span className="mx-2 text-white/40" aria-hidden>·</span>
            Levert av{" "}
            <TrackedLink
              href="https://thorvaldsendigital.no"
              target="_blank"
              event={EVENTS.CLICKED_OUTBOUND_LINK}
              eventProps={{ location: "footer", link: "thorvaldsen_digital" }}
              className="hover:text-white hover:underline"
            >
              Thorvaldsen Digital
            </TrackedLink>
          </p>
          <CookieSettingsButton />
        </div>
      </div>
      {/* Spacer so the sticky mobile booking bar never covers footer content */}
      <div className="h-20 md:hidden" aria-hidden />
    </footer>
  );
}
