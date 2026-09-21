import type { Metadata } from "next";
import { BookingButton } from "@/components/BookingButton";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { TrackPageView, TrackSection } from "@/components/analytics/TrackView";
import { ArrowRight, Clock } from "@/components/Icons";
import { PriceList } from "@/components/PriceList";
import { BookingCtaBand, CheckList } from "@/components/Sections";
import { EVENTS } from "@/lib/analytics";
import { breadcrumbJsonLd } from "@/lib/seo";
import { hege } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ultralydundersøkelse i Asker – muskler, sener og ledd",
  description:
    "Ultralydundersøkelse av muskler, sener og ledd hos Føyka i Asker sentrum. Time raskt, ingen henvisning. 30 minutter 1100,- / 60 minutter 1500,-.",
  alternates: { canonical: "/ultralyd" },
};

export default function UltralydPage() {
  return (
    <>
      <TrackPageView event={EVENTS.VIEWED_ULTRALYD_PAGE} funnelStep="service_page_viewed" eventProps={{ service: "ultralyd" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("Ultralyd", "/ultralyd")) }} />

      <section className="relative overflow-hidden">
        <div aria-hidden className="blob-2 absolute -top-32 -left-40 size-[34rem] bg-mint-200/70" />
        <div className="container-page relative grid items-center gap-10 pt-10 pb-6 lg:grid-cols-2 lg:pt-16">
          <div>
            <span className="chip bg-primary text-secondary"><Clock width={15} height={15} /> Time raskt · ingen henvisning</span>
            <h1 className="h1 mt-5">Ultralyd&shy;undersøkelse</h1>
            <p className="lead mt-5 max-w-xl">
              Med ultralyd kan vi se på muskler, sener og ledd mens du er hos oss. Det gir et bedre
              grunnlag for riktig diagnose – og riktig behandling.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BookingButton location="hero" service="ultralyd" size="lg" label="Bestill ultralyd" />
              <TrackedLink href="#priser" event={EVENTS.CLICKED_CTA} eventProps={{ cta: "se_priser", location: "hero" }} className="btn btn-outline btn-lg">
                Se priser
              </TrackedLink>
            </div>
          </div>

          <TrackSection section="priser" funnelStep="pricing_viewed">
            <div id="priser" className="card ring-2 ring-primary">
              <h2 className="font-display text-2xl font-extrabold">Priser – ultralyd</h2>
              <p className="mt-1 text-[0.95rem]">Privat, fullbetalt tilbud. Frikort gjelder ikke.</p>
              <div className="mt-3"><PriceList groups={["ultralyd"]} /></div>
              <BookingButton location="pricing" service="ultralyd" size="lg" label="Bestill ultralyd" className="mt-5 w-full" />
            </div>
          </TrackSection>
        </div>
      </section>

      <section className="container-page mt-16 grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="font-display text-2xl font-extrabold">Når er ultralyd nyttig?</h2>
          <p className="mt-3 mb-5">Ultralyd brukes som et supplement til den kliniske undersøkelsen, for eksempel ved:</p>
          <CheckList items={["Skulder-, albue- og håndleddsmerter", "Hofte-, kne-, ankel- og fotsmerter", "Akutte og belastningsrelaterte plager", "Idrettsskader"]} />
        </div>
        <div className="card">
          <h2 className="font-display text-2xl font-extrabold">Slik foregår det</h2>
          <p className="mt-3">
            Undersøkelsen gjøres av {hege.name}, osteopat og fysioterapeut. Du kan bestille en egen
            ultralydundersøkelse på 30 eller 60 minutter, eller få ultralyd som et tillegg til en senere
            konsultasjon.
          </p>
          <p className="mt-4">
            Undersøkelsen er smertefri. Funnene blir forklart underveis, og du får en vurdering av hva
            som bør være neste steg.
          </p>
          <TrackedLink href="/osteopati" event={EVENTS.CLICKED_CTA} eventProps={{ cta: "les_mer_osteopati", location: "ultralyd_info" }} className="link mt-5 inline-flex items-center gap-1.5">
            Les om osteopati <ArrowRight width={18} height={18} />
          </TrackedLink>
        </div>
      </section>

      <BookingCtaBand
        location="ultralyd_bottom"
        service="ultralyd"
        title="Få svar på hva som er galt"
        text="Bestill ultralydundersøkelse – time raskt og ingen henvisning nødvendig."
      />
    </>
  );
}
