import type { Metadata } from "next";
import { BookingButton } from "@/components/BookingButton";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { TrackPageView, TrackSection } from "@/components/analytics/TrackView";
import { Faq } from "@/components/Faq";
import { ArrowRight, Check, Clock } from "@/components/Icons";
import { PriceList } from "@/components/PriceList";
import { BookingCtaBand, CheckList, HegeContactOptions } from "@/components/Sections";
import { TherapistPortrait } from "@/components/TherapistCard";
import { EVENTS } from "@/lib/analytics";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { clinic, hege } from "@/lib/site";

export const metadata: Metadata = {
  title: "Osteopat i Asker – time raskt",
  description:
    "Osteopati hos Føyka i Asker sentrum. Helhetlig, skånsom manuell behandling av rygg, nakke, skulder, hofte, hodepine og mer. Time raskt, ingen henvisning. Konsultasjon 1200,-.",
  alternates: { canonical: "/osteopati" },
};

const conditions = [
  "Smerter og plager fra muskel-skjelett apparatet",
  "Rygg-, bryst- og nakkesmerter",
  "Skulder-, albue- og håndleddsmerter",
  "Hofte-, kne-, ankel- og fotsmerter",
  "Hodepine, svimmelhet og balanseproblemer",
  "Bekkensmerter og andre plager i forbindelse med svangerskap",
  "Funksjonelle plager hos spedbarn",
  "Akutte og belastningsrelaterte plager, idrettsskader",
];

const faq = [
  {
    q: "Trenger jeg henvisning fra lege?",
    a: "Nei. Du trenger ikke henvisning for å bestille time hos osteopaten. Osteopaten samarbeider med annet helsepersonell når det er nødvendig.",
  },
  {
    q: "Hvor raskt kan jeg få time?",
    a: "Osteopaten vår er privatpraktiserende og tilbyr time raskt. Bestill på nett eller ta kontakt direkte, så finner vi en tid som passer.",
  },
  {
    q: "Gjelder frikort hos osteopaten?",
    a: "Nei. Osteopati og ultralyd er et privat, fullbetalt tilbud, og frikort gjelder ikke. Ønsker du behandling med egenandel og frikort, kan du kontakte en av fysioterapeutene våre med kommunal avtale.",
  },
  {
    q: "Hva skjer i den første timen?",
    a: "Hver konsultasjon består av undersøkelse og behandling og er spesielt tilpasset deg. Osteopaten går gjennom sykehistorien din, ser på holdning og bevegelse og kjenner etter spenninger i vevet. Deretter lager dere sammen en plan for behandlingen.",
  },
  {
    q: "Passer osteopati for meg?",
    a: "Osteopatibehandlingen er skånsom og passer for alle, fra spedbarn til eldre. Du blir alltid vurdert med hensyn til tegn på plager som ikke kan behandles av osteopaten, og henvises videre ved behov.",
  },
  {
    q: "Hva koster det?",
    a: "Konsultasjon koster 1200,- og behandling 800,-. Ultralydundersøkelse koster 1500,- (60 minutter) eller 1100,- (30 minutter). Ultralyd som tillegg til senere konsultasjoner koster 300,-.",
  },
];

export default function OsteopatiPage() {
  return (
    <>
      <TrackPageView event={EVENTS.VIEWED_OSTEOPATI_PAGE} funnelStep="service_page_viewed" eventProps={{ service: "osteopati" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faq)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("Osteopati", "/osteopati")) }} />

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="blob absolute -top-32 -right-40 size-[36rem] bg-mint-200/70" />
        <div className="container-page relative grid items-center gap-10 pt-10 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16 lg:pb-20">
          <div>
            <span className="chip bg-primary text-secondary"><Clock width={15} height={15} /> Time raskt · ingen henvisning</span>
            <h1 className="h1 mt-5">Osteopat i Asker sentrum</h1>
            <p className="lead mt-5 max-w-xl">
              Helhetlig og skånsom manuell behandling av smerter og plager i muskler og ledd.
              Grundig undersøkelse, tydelig plan – og kort vei til time.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <BookingButton location="hero" size="lg" label="Bestill time" />
              <TrackedLink href="#priser" event={EVENTS.CLICKED_CTA} eventProps={{ cta: "se_priser", location: "hero" }} className="btn btn-outline btn-lg">
                Se priser
              </TrackedLink>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-semibold text-secondary">
              {["Konsultasjon 1200,-", "Passer for alle aldre", `${clinic.street}, ${clinic.city}`].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check width={18} height={18} strokeWidth={3} className="text-primary-dark" /> {t}</li>
              ))}
            </ul>
          </div>

          <div className="card mx-auto flex w-full max-w-sm flex-col items-center text-center">
            <TherapistPortrait t={hege} className="w-40" />
            <h2 className="mt-4 font-display text-2xl font-extrabold">{hege.name}</h2>
            <p className="font-semibold">{hege.title}</p>
            <p className="mt-2 text-[0.95rem]">Privatpraktiserende hos {clinic.name}.</p>
            <BookingButton location="hero_therapist_card" label={`Bestill time hos ${hege.name.split(" ")[0]}`} className="mt-5 w-full" />
          </div>
        </div>
      </section>

      {/* ---------- CONDITIONS ---------- */}
      <TrackSection section="plager">
        <section className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Kjenner du deg igjen?</p>
            <h2 className="h2 mt-3">Dette hjelper osteopaten deg med</h2>
            <p className="mt-4">Pasienter som oppsøker osteopat har ofte tilstander som:</p>
            <div className="mt-5"><CheckList items={conditions} /></div>
          </div>
          <div className="rounded-[2.5rem] bg-sand p-7 sm:p-10">
            <h3 className="font-display text-xl font-extrabold">Mer enn muskler og ledd</h3>
            <p className="mt-3">
              I tillegg til muskel-skjelett plager oppsøker noen pasienter osteopater ved funksjonelle
              mage-, tarm- og urinveisplager, fordøyelsesbesvær, halsbrann og sure oppstøt, stress,
              søvnproblemer, tung pust og pustebesvær.
            </p>
            <p className="mt-4 font-semibold text-secondary">
              Osteopatibehandlingen er skånsom og passer for alle, fra spedbarn til eldre.
            </p>
            <BookingButton location="plager" className="mt-6" />
          </div>
        </section>
      </TrackSection>

      {/* ---------- WHAT IS ---------- */}
      <section className="container-page mt-24">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Hva er osteopati?</h2>
            <p className="mt-4">
              Osteopati er en helhetlig og manuell behandlingsform som bygger på kunnskap om medisinske
              fag som anatomi, fysiologi, nevrologi, biomekanikk og patologi. Den medisinske kompetansen
              er høy, og ofte samarbeider osteopaten med annet helsepersonell når det er nødvendig.
            </p>
          </div>
          <div className="card">
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Hva gjør osteopaten?</h2>
            <p className="mt-4">
              Osteopaten gjør en grundig undersøkelse som innebærer gjennomgang av pasientens
              sykehistorie, holdningsanalyse, bevegelsestesting, sikkerhetstesting og palpasjon (kjenner
              etter forandringer/spenninger i vevet). Undersøkelsen leder til en diagnose som viser hvor
              i kroppen de viktigste spenningene er. Osteopaten bruker manuelle teknikker (hendene) for å
              undersøke og behandle pasienten.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- PROCESS ---------- */}
      <TrackSection section="slik_foregar_det">
        <section className="container-page mt-24">
          <p className="eyebrow">Slik foregår det</p>
          <h2 className="h2 mt-3">Fra første time til bedre hverdag</h2>
          <ol className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                h: "Bestill time",
                p: "Velg en tid som passer deg. Du trenger ingen henvisning, og osteopaten tilbyr time raskt.",
              },
              {
                h: "Konsultasjon",
                p: "Hver konsultasjon består av undersøkelse og behandling og er spesielt tilpasset hver enkelt pasient. Osteopaten vil undersøke deg nøye, og kan be deg om å gjøre enkle bevegelser og observere din holdning og funksjon. Områder som er smertefulle og oppleves som stive kan være forbundet med problemer i andre områder. Osteopaten vil også evaluere vevskvalitet og leddbevegelighet. Du vil bli vurdert med hensyn til tegn og symptomer på alvorlige plager som ikke kan behandles av osteopaten, og eventuelt henvises videre.",
              },
              {
                h: "Behandling",
                p: "Osteopaten vil sammen med deg lage en plan for behandlingene, hva du kan forvente og hva du selv må ta ansvar for. Diagnosen avgjør behandlingen, som består av mange ulike teknikker som mobilisering, avspenning, korrigering av ledd (manipulasjon) eller tøyninger. Behandlingen foregår hovedsakelig på benk, men du får også råd, veiledning og øvelser tilrettelagt for deg.",
              },
            ].map((s, i) => (
              <li key={s.h} className="card relative">
                <span aria-hidden className="blob inline-flex size-14 items-center justify-center bg-primary font-display text-2xl font-black text-secondary">{i + 1}</span>
                <h3 className="mt-4 font-display text-2xl font-extrabold">{s.h}</h3>
                <p className="mt-2 text-[0.98rem]">{s.p}</p>
              </li>
            ))}
          </ol>
        </section>
      </TrackSection>

      {/* ---------- PRICES ---------- */}
      <TrackSection section="priser" funnelStep="pricing_viewed">
        <section id="priser" className="container-page mt-24">
          <div className="on-dark relative overflow-hidden rounded-[2.5rem] bg-secondary p-7 text-white sm:p-12 lg:grid lg:grid-cols-2 lg:gap-14">
            <div aria-hidden className="blob absolute -top-28 -right-24 size-80 bg-primary/15" />
            <div className="relative">
              <p className="eyebrow !text-primary">Priser</p>
              <h2 className="h2 mt-3 text-white">Enkle, forutsigbare priser</h2>
              <p className="mt-4 text-white/85">
                Osteopati og ultralyd er et privat, fullbetalt tilbud (frikort gjelder ikke). Har du
                helseforsikring, kan du sjekke med forsikringsselskapet ditt om behandlingen dekkes.
              </p>
              <div className="mt-8 hidden lg:block">
                <BookingButton location="pricing" size="lg" label="Bestill time" />
                <div className="mt-5"><HegeContactOptions location="pricing" dark /></div>
              </div>
            </div>
            <div className="relative mt-6 lg:mt-0">
              <PriceList dark />
              <TrackedLink href="/ultralyd" event={EVENTS.CLICKED_CTA} eventProps={{ cta: "les_mer_ultralyd", location: "pricing" }} className="mt-3 inline-flex items-center gap-1.5 font-semibold text-white/90 hover:underline">
                Les mer om ultralydundersøkelse <ArrowRight width={18} height={18} />
              </TrackedLink>
              <div className="mt-7 lg:hidden">
                <BookingButton location="pricing" size="lg" label="Bestill time" className="w-full" />
              </div>
            </div>
          </div>
        </section>
      </TrackSection>

      {/* ---------- FAQ ---------- */}
      <TrackSection section="faq">
        <section className="container-page mt-24 max-w-3xl">
          <h2 className="h2 text-center">Ofte stilte spørsmål</h2>
          <div className="mt-8"><Faq items={faq} location="osteopati" /></div>
        </section>
      </TrackSection>

      <BookingCtaBand location="osteopati_bottom" />
    </>
  );
}
