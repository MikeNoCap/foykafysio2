import type { Metadata } from "next";
import { BookingButton } from "@/components/BookingButton";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { TrackPageView } from "@/components/analytics/TrackView";
import { Clock, Phone } from "@/components/Icons";
import { PriceList } from "@/components/PriceList";
import { CheckList, HegeContactOptions } from "@/components/Sections";
import { TherapistCard } from "@/components/TherapistCard";
import { EVENTS } from "@/lib/analytics";
import { clinic, HAS_ONLINE_BOOKING, hege, therapists } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bestill time",
  description:
    "Bestill time hos Føyka Fysioterapi og Osteopati i Asker. Osteopat med time raskt (privat), eller fysioterapeut med kommunal avtale.",
  alternates: { canonical: "/bestill-time" },
};

export default function BestillTimePage() {
  const fysios = therapists.filter((t) => t.agreement === "kommunal");
  return (
    <>
      <TrackPageView event={EVENTS.VIEWED_BOOKING_PAGE} funnelStep="booking_page_viewed" />

      <section className="container-page pt-10 lg:pt-16">
        <h1 className="h1">Bestill time</h1>
        <p className="lead mt-4 max-w-2xl">Du trenger ingen henvisning. Velg tilbudet som passer deg.</p>
      </section>

      {/* ---------- HEGE: primary ---------- */}
      <section id="osteopat" className="container-page mt-10">
        <div className="on-dark relative overflow-hidden rounded-[2.5rem] bg-secondary p-7 text-white sm:p-12 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div aria-hidden className="blob absolute -top-28 -right-24 size-80 bg-primary/15" />
          <div className="relative">
            <span className="chip bg-primary text-secondary"><Clock width={15} height={15} /> Time raskt</span>
            <h2 className="h2 mt-4 text-white">Osteopat {hege.name}</h2>
            <p className="mt-3 text-white/85">
              Osteopati og ultralydundersøkelse. Privat, fullbetalt tilbud (frikort gjelder ikke).
            </p>
            <div className="mt-7">
              {HAS_ONLINE_BOOKING ? (
                <>
                  <BookingButton location="booking_page" size="lg" label="Bestill time på nett" />
                  <p className="mt-6 mb-3 text-white/80">Eller ta kontakt direkte:</p>
                </>
              ) : (
                <p className="mb-4 font-display text-xl font-bold text-white">Ta kontakt, så får du time raskt:</p>
              )}
              <HegeContactOptions location="booking_page" dark />
            </div>
            <div className="mt-8"><CheckList dark items={["Ingen henvisning nødvendig", "Kort ventetid", `${clinic.street}, ${clinic.postalCode} ${clinic.city}`]} /></div>
          </div>
          <div className="relative mt-8 lg:mt-0">
            <h3 className="font-display text-xl font-bold text-white">Priser</h3>
            <PriceList dark />
          </div>
        </div>
      </section>

      {/* ---------- MUNICIPAL ---------- */}
      <section id="fysioterapi" className="container-page mt-20">
        <span className="chip bg-mint-200 text-ink">Kommunal avtale</span>
        <h2 className="h2 mt-3">Fysioterapeut med kommunal avtale</h2>
        <p className="mt-4 max-w-3xl">
          Fysioterapeutene våre har kommunal driftsavtale. Du betaler kun egenandel, og egenandelene
          inngår i frikortordningen. Ta kontakt direkte med behandleren du ønsker time hos, eller ring
          klinikken.
        </p>
        <TrackedLink href={clinic.phoneHref} event={EVENTS.CLICKED_PHONE} eventProps={{ location: "booking_page", therapist: "clinic" }} className="btn btn-dark mt-6">
          <Phone /> Ring klinikken: {clinic.phone}
        </TrackedLink>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fysios.map((t) => (
            <TherapistCard key={t.id} t={t} location="booking_page" />
          ))}
        </ul>
        <p className="mt-8 text-[0.95rem]">
          Avbestilling må skje senest 24 timer før avtalt time. Timer som ikke benyttes må betales i sin helhet.
        </p>
      </section>
    </>
  );
}
