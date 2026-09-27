import Image from "next/image";
import { BookingButton } from "@/components/BookingButton";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { TrackPageView, TrackSection } from "@/components/analytics/TrackView";
import { ArrowRight, Check, Clock, Mail, Phone, Pin } from "@/components/Icons";
import { LazyEmbed } from "@/components/LazyEmbed";
import { CheckList } from "@/components/Sections";
import { TherapistCard } from "@/components/TherapistCard";
import { EVENTS } from "@/lib/analytics";
import { getContent } from "@/lib/content";
import { formatPrice, services } from "@/lib/site";
import { EmailText, PhoneText } from "@/components/ContactText";

export default function Home() {
  const { clinic, hege, therapists, priceOf } = getContent();
  const consultation = priceOf("konsultasjon");
  return (
    <>
      <TrackPageView funnelStep="landing_viewed" />

      {/* ---------- HERO: institute identity, with the municipal and the private offer side by side ---------- */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="blob absolute -top-40 -right-40 size-[38rem] bg-mint-200/70" />
        <div aria-hidden className="blob-2 absolute top-72 -left-52 size-[28rem] bg-mint-100" />

        <div className="container-page relative grid items-center gap-12 pt-10 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20 lg:pb-24">
          <div>
            <p className="eyebrow">Fysikalsk institutt i Asker sentrum</p>
            <h1 className="h1 mt-4">
              Bedre helse og bevegelse – <span className="text-primary-dark">i hjertet av Asker</span>
            </h1>
            <p className="lead mt-6 max-w-xl">
              Hos oss får du <strong>allmenn og psykomotorisk fysioterapi</strong> med kommunal
              driftsavtale, og <strong>privat osteopati og fysioterapi</strong> med time raskt.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <TrackedLink
                href="/bestill-time#fysioterapi"
                event={EVENTS.CLICKED_BOOKING_FYSIOTERAPI}
                eventProps={{ location: "hero" }}
                className="btn btn-dark btn-lg"
              >
                Kontakt – kommunalt tilbud
              </TrackedLink>
              <TrackedLink
                href="/bestill-time#osteopat"
                event={EVENTS.CLICKED_CTA}
                eventProps={{ cta: "kontakt_privat_tilbud", location: "hero" }}
                className="btn btn-outline btn-lg"
              >
                Kontakt – privat tilbud
              </TrackedLink>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-semibold text-secondary">
              {["Driftsavtale med Asker kommune", "Privat osteopat – time raskt", "Ingen henvisning nødvendig"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check width={18} height={18} strokeWidth={3} className="text-primary-dark" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Offer card: every treatment, grouped by how it is paid for */}
          <div className="relative mx-auto w-full max-w-md">
            <div aria-hidden className="blob absolute -inset-5 rotate-6 bg-primary/90" />
            <div className="on-dark relative rounded-[2.5rem] bg-secondary p-7 text-white shadow-soft sm:p-9">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-3xl font-extrabold text-white">Dette tilbyr vi</h2>
                <Image src="/logo/logo-horizontal-light.svg" alt="" width={77} height={48} className="h-12 w-auto opacity-90" />
              </div>
              {(
                [
                  { agreement: "kommunal", label: "Driftsavtale med Asker kommune" },
                  { agreement: "privat", label: "Privat tilbud · time raskt" },
                ] as const
              ).map((group) => (
                <div key={group.agreement} className="mt-5">
                  <span className="chip bg-primary text-secondary">{group.label}</span>
                  <ul className="mt-3 grid gap-2">
                    {services.filter((s) => s.agreement === group.agreement).map((s) => (
                      <li key={s.href}>
                        <TrackedLink
                          href={s.href}
                          event={EVENTS.CLICKED_SERVICE_CARD}
                          eventProps={{ service: s.title, location: "hero_card" }}
                          className="group flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-5 py-3 font-display text-lg font-bold text-white transition hover:bg-white/20"
                        >
                          {s.title}
                          <ArrowRight className="shrink-0 text-primary transition group-hover:translate-x-1" />
                        </TrackedLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="mt-5 text-[0.95rem] text-white/80">Du trenger ikke henvisning fra lege.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SERVICES ---------- */}
      <TrackSection section="tjenester">
        <section id="tjenester" className="container-page">
          <p className="eyebrow">Tjenester</p>
          <h2 className="h2 mt-3">Våre behandlingstilbud</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {services.map((s, i) => (
              <li key={s.href} className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"}>
                <TrackedLink
                  href={s.href}
                  event={EVENTS.CLICKED_SERVICE_CARD}
                  eventProps={{ service: s.title, location: "tjenester" }}
                  className="group flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-soft transition hover:-translate-y-1"
                >
                  <span className={`chip self-start ${s.agreement === "privat" ? "bg-secondary text-white" : "bg-mint-200 text-ink"}`}>{s.badge}</span>
                  <h3 className="mt-4 font-display text-2xl font-extrabold">{s.title}</h3>
                  <p className="mt-2 flex-1">{s.text}</p>
                  <span className="mt-5 flex items-center gap-1.5 font-display font-bold text-secondary">
                    Les mer <ArrowRight width={18} height={18} className="transition group-hover:translate-x-1" />
                  </span>
                </TrackedLink>
              </li>
            ))}
          </ul>
        </section>
      </TrackSection>

      {/* ---------- TWO OFFERS: municipal and private, given equal weight ---------- */}
      <TrackSection section="osteopat_band">
        <section className="container-page mt-24">
          <p className="eyebrow">To tilbud under samme tak</p>
          <h2 className="h2 mt-3">Kommunal avtale eller privat time</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col rounded-[2.5rem] bg-mint-100 p-7 sm:p-10">
              <span className="chip self-start bg-white text-ink">Driftsavtale med Asker kommune</span>
              <h3 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">Fysioterapi med kommunal avtale</h3>
              <p className="mt-3">
                Fysioterapeutene våre har kommunal driftsavtale og avtale med Helfo. Du betaler kun
                egenandel dersom du ikke har frikort.
              </p>
              <div className="mt-6 flex-1">
                <CheckList items={["Allmenn og psykomotorisk fysioterapi", "Egenandeler inngår i frikortordningen", "Ingen henvisning nødvendig"]} />
              </div>
              <TrackedLink href="/bestill-time#fysioterapi" event={EVENTS.CLICKED_BOOKING_FYSIOTERAPI} eventProps={{ location: "driftsavtale" }} className="btn btn-dark mt-8 self-start">
                Kontakt – kommunalt tilbud <ArrowRight />
              </TrackedLink>
            </div>

            <div className="on-dark relative flex flex-col overflow-hidden rounded-[2.5rem] bg-secondary p-7 text-white sm:p-10">
              <div aria-hidden className="blob absolute -right-20 -bottom-24 size-72 bg-primary/20" />
              <span className="chip relative self-start bg-primary text-secondary"><Clock width={15} height={15} /> Privat tilbud · time raskt</span>
              <h3 className="relative mt-4 font-display text-2xl font-extrabold text-white sm:text-3xl">Privat osteopat og fysioterapeut</h3>
              <p className="relative mt-3 text-white/85">
                {hege.name} er privatpraktiserende osteopat og fysioterapeut, og tilbyr time raskt.
                Dette er et fullbetalt tilbud (frikort gjelder ikke).
              </p>
              <div className="relative mt-6 flex-1">
                <CheckList dark items={["Osteopati og ultralydundersøkelse", ...(consultation !== undefined ? [`Konsultasjon ${formatPrice(consultation)}`] : []), "Ingen henvisning nødvendig"]} />
              </div>
              <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
                <BookingButton location="landing_osteopat_band" />
                <TrackedLink href="/osteopati" event={EVENTS.CLICKED_CTA} eventProps={{ cta: "les_mer_osteopati", location: "landing_osteopat_band" }} className="btn btn-outline-light">
                  Les om osteopati <ArrowRight />
                </TrackedLink>
              </div>
            </div>
          </div>
        </section>
      </TrackSection>

      {/* ---------- ABOUT ---------- */}
      <section id="hvem-er-vi" className="container-page mt-24">
        <div className="rounded-[2.5rem] bg-sand p-7 sm:p-12 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <p className="eyebrow">Hvem er vi</p>
            <h2 className="h2 mt-3">Velkommen til oss</h2>
          </div>
          <div className="mt-5 grid gap-4 lg:mt-0">
            <p>
              <strong>{clinic.name}</strong> er et fysikalsk institutt i hjertet av Asker, med
              driftsavtale med Asker kommune. Vi er et
              team av erfarne terapeuter som brenner for faget vårt og for å hjelpe våre pasienter til
              en bedre hverdag.
            </p>
            <p>
              Du finner oss i nye, moderne lokaler i <strong>Erteløkka 1</strong>. Her tilbyr vi
              behandling av høy faglig kvalitet i et trygt og profesjonelt miljø.
            </p>
            <p>
              Våre fysioterapeuter har alle kommunal avtale. Vi har også en privatpraktiserende
              osteopat og fysioterapeut, som tilbyr time raskt. Dette er et fullbetalt tilbud (frikort
              gjelder ikke).
            </p>
          </div>
        </div>
      </section>

      {/* ---------- TEAM ---------- */}
      <TrackSection section="behandlerne">
        <section id="behandlerne" className="container-page mt-24">
          <p className="eyebrow">Teamet</p>
          <h2 className="h2 mt-3">Våre behandlere</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...therapists].sort((a, b) => Number(a.agreement === "privat") - Number(b.agreement === "privat")).map((t) => (
              <TherapistCard key={t.id} t={t} location="landing_behandlere" />
            ))}
          </ul>
        </section>
      </TrackSection>

      {/* ---------- PRACTICAL INFO ---------- */}
      <section id="praktisk-info" className="container-page mt-24">
        <p className="eyebrow">Godt å vite</p>
        <h2 className="h2 mt-3">Praktisk informasjon</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { h: "Henvisning", p: "Du trenger ikke henvisning fra lege for å få behandling hos oss. Vi samarbeider likevel tett med fastleger ved behov." },
            { h: "Priser og refusjon", p: "Fysioterapeutene har avtale med Helfo, og egenandeler inngår i frikortordningen. Osteopati og ultralyd er et privat, fullbetalt tilbud. Vi tar også imot pasienter med helseforsikring." },
            { h: "Avbestilling", p: "Avbestilling må skje senest 24 timer før avtalt time. Timer som ikke benyttes må betales i sin helhet." },
          ].map((c) => (
            <div key={c.h} className="card">
              <h3 className="font-display text-xl font-extrabold">{c.h}</h3>
              <p className="mt-2">{c.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <TrackSection section="kontakt">
        <section id="kontakt-oss" className="container-page mt-24">
          <p className="eyebrow">Her finner du oss</p>
          <h2 className="h2 mt-3">Kontakt oss</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <address className="card grid content-start gap-6 not-italic">
              <div className="flex gap-4">
                <span className="blob inline-flex size-12 shrink-0 items-center justify-center bg-mint-200 text-secondary"><Pin /></span>
                <div>
                  <h3 className="font-display text-lg font-bold">Adresse</h3>
                  <p>{clinic.street}, {clinic.postalCode} {clinic.city}</p>
                  {clinic.addressNote && <p className="text-[0.95rem] font-semibold">{clinic.addressNote}</p>}
                  <TrackedLink href={clinic.mapsUrl} target="_blank" event={EVENTS.CLICKED_OUTBOUND_LINK} eventProps={{ location: "kontakt", link: "google_maps" }} className="link">
                    Åpne i Google Maps
                  </TrackedLink>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="blob inline-flex size-12 shrink-0 items-center justify-center bg-mint-200 text-secondary"><Phone /></span>
                <div>
                  <h3 className="font-display text-lg font-bold">Telefon</h3>
                  <p>
                    Kommunalt tilbud:{" "}
                    <TrackedLink href={clinic.phoneHref} event={EVENTS.CLICKED_PHONE} eventProps={{ location: "kontakt", therapist: "clinic" }} className="link"><PhoneText>{clinic.phone}</PhoneText></TrackedLink>
                  </p>
                  <p>
                    Privat tilbud ({hege.name}):{" "}
                    <TrackedLink href={hege.phoneHref} event={EVENTS.CLICKED_PHONE} eventProps={{ location: "kontakt", therapist: "hege" }} className="link"><PhoneText>{hege.phone}</PhoneText></TrackedLink>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="blob inline-flex size-12 shrink-0 items-center justify-center bg-mint-200 text-secondary"><Mail /></span>
                <div>
                  <h3 className="font-display text-lg font-bold">E-post</h3>
                  <p>
                    Kommunalt tilbud:{" "}
                    <TrackedLink href={`mailto:${clinic.email}`} event={EVENTS.CLICKED_EMAIL} eventProps={{ location: "kontakt", therapist: "clinic" }} className="link"><EmailText>{clinic.email}</EmailText></TrackedLink>
                  </p>
                  <p>
                    Privat tilbud:{" "}
                    <TrackedLink href={`mailto:${hege.email}`} event={EVENTS.CLICKED_EMAIL} eventProps={{ location: "kontakt", therapist: "hege" }} className="link"><EmailText>{hege.email}</EmailText></TrackedLink>
                  </p>
                  <p className="mt-1 text-sm">Ikke send sensitive helseopplysninger på e-post.</p>
                </div>
              </div>
            </address>
            <LazyEmbed
              src={clinic.mapsEmbedUrl}
              title={`Kart: ${clinic.street}, ${clinic.city}`}
              className="min-h-80"
            />
          </div>
        </section>
      </TrackSection>

    </>
  );
}
