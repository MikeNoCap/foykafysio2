import Image from "next/image";
import { BookingButton } from "@/components/BookingButton";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { TrackPageView, TrackSection } from "@/components/analytics/TrackView";
import { ArrowRight, Check, Clock, Mail, Phone, Pin } from "@/components/Icons";
import { LazyEmbed } from "@/components/LazyEmbed";
import { CheckList, FysioCtaBand } from "@/components/Sections";
import { TherapistCard } from "@/components/TherapistCard";
import { EVENTS } from "@/lib/analytics";
import { clinic, formatPrice, hege, services, therapists } from "@/lib/site";

export default function Home() {
  return (
    <>
      <TrackPageView funnelStep="landing_viewed" />

      {/* ---------- HERO: physiotherapy institute first ---------- */}
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
              Vi tilbyr <strong>allmenn fysioterapi</strong> og <strong>psykomotorisk fysioterapi</strong>.
              Alle fysioterapeutene våre har kommunal driftsavtale – du betaler kun egenandel, og
              frikort gjelder.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <TrackedLink
                href="/bestill-time#fysioterapi"
                event={EVENTS.CLICKED_BOOKING_FYSIOTERAPI}
                eventProps={{ location: "hero" }}
                className="btn btn-dark btn-lg"
              >
                Kontakt en fysioterapeut
              </TrackedLink>
              <TrackedLink
                href="#tjenester"
                event={EVENTS.CLICKED_CTA}
                eventProps={{ cta: "se_tjenester", location: "hero" }}
                className="btn btn-outline btn-lg"
              >
                Våre behandlingstilbud
              </TrackedLink>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-semibold text-secondary">
              {["Kun egenandel – frikort gjelder", "Ingen henvisning nødvendig", "Nye lokaler i Erteløkka 1"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check width={18} height={18} strokeWidth={3} className="text-primary-dark" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Core offer card: the two main disciplines */}
          <div className="relative mx-auto w-full max-w-md">
            <div aria-hidden className="blob absolute -inset-5 rotate-6 bg-primary/90" />
            <div className="on-dark relative rounded-[2.5rem] bg-secondary p-7 text-white shadow-soft sm:p-9">
              <div className="flex items-center justify-between gap-3">
                <span className="chip bg-primary text-secondary">Driftsavtale med Asker kommune</span>
                <Image src="/logo/logo-horizontal-light.svg" alt="" width={77} height={48} className="h-12 w-auto opacity-90" />
              </div>
              <h2 className="mt-5 font-display text-3xl font-extrabold text-white">Dette tilbyr vi</h2>
              <ul className="mt-5 grid gap-3">
                {services.filter((s) => s.agreement === "kommunal").map((s) => (
                  <li key={s.href}>
                    <TrackedLink
                      href={s.href}
                      event={EVENTS.CLICKED_SERVICE_CARD}
                      eventProps={{ service: s.title, location: "hero_card" }}
                      className="group flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-5 py-4 font-display text-lg font-bold text-white transition hover:bg-white/20"
                    >
                      {s.title}
                      <ArrowRight className="shrink-0 text-primary transition group-hover:translate-x-1" />
                    </TrackedLink>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.95rem] text-white/80">
                Du betaler kun egenandel dersom du ikke har frikort. Du trenger ikke henvisning fra lege.
              </p>
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
              <li key={s.href} className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}>
                <TrackedLink
                  href={s.href}
                  event={EVENTS.CLICKED_SERVICE_CARD}
                  eventProps={{ service: s.title, location: "tjenester" }}
                  className={`group flex h-full flex-col rounded-[2rem] p-7 shadow-soft transition hover:-translate-y-1 ${
                    i < 2 ? "bg-gradient-to-br from-mint-200 to-mint-100 sm:p-9" : "bg-white"
                  }`}
                >
                  <span className={`chip self-start ${s.agreement === "privat" ? "bg-secondary text-white" : i < 2 ? "bg-white text-ink" : "bg-mint-100 text-ink"}`}>{s.badge}</span>
                  <h3 className={`mt-4 font-display font-extrabold ${i < 2 ? "text-3xl" : "text-2xl"}`}>{s.title}</h3>
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

      {/* ---------- DRIFTSAVTALE EXPLAINER ---------- */}
      <section className="container-page mt-24">
        <div className="on-dark relative overflow-hidden rounded-[2.5rem] bg-secondary p-7 text-white sm:p-12 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div aria-hidden className="blob absolute -right-20 -bottom-24 size-72 bg-primary/20" />
          <div className="relative">
            <p className="eyebrow !text-primary">Driftsavtale med Asker kommune</p>
            <h2 className="h2 mt-3 text-white">Du betaler kun egenandel</h2>
            <p className="mt-4 text-white/85">
              Alle våre fysioterapeuter har kommunal driftsavtale. Det betyr at du kun betaler egenandel
              dersom du ikke har frikort. Vi har avtale med Helfo, og egenandelene inngår i
              frikortordningen.
            </p>
            <TrackedLink href="/bestill-time#fysioterapi" event={EVENTS.CLICKED_BOOKING_FYSIOTERAPI} eventProps={{ location: "driftsavtale" }} className="btn btn-outline-light mt-7">
              Slik bestiller du time <ArrowRight />
            </TrackedLink>
          </div>
          <div className="relative mt-8 lg:mt-0">
            <CheckList dark items={["Egenandeler inngår i frikortordningen", "Ingen henvisning nødvendig", "Tett samarbeid med fastleger ved behov", "Vi tar også imot pasienter med helseforsikring"]} />
          </div>
        </div>
      </section>

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

      {/* ---------- PRIVATE OSTEOPATH: one compact band ---------- */}
      <TrackSection section="osteopat_band">
        <section className="container-page mt-16">
          <div className="rounded-[2.5rem] bg-mint-100 p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <span className="chip bg-secondary text-white"><Clock width={15} height={15} /> Privat · time raskt</span>
              <h2 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">Vi har også osteopat</h2>
              <p className="mt-3">
                Vi har også en privatpraktiserende osteopat og fysioterapeut, {hege.name}, som tilbyr time
                raskt. Dette er et fullbetalt tilbud (frikort gjelder ikke). Konsultasjon {formatPrice(1200)}
              </p>
            </div>
            <div className="mt-6 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
              <BookingButton location="landing_osteopat_band" />
              <TrackedLink href="/osteopati" event={EVENTS.CLICKED_CTA} eventProps={{ cta: "les_mer_osteopati", location: "landing_osteopat_band" }} className="btn btn-outline">
                Les om osteopati <ArrowRight />
              </TrackedLink>
            </div>
          </div>
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
                  <p className="text-[0.95rem] font-semibold">{clinic.addressNote}</p>
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
                    Klinikken:{" "}
                    <TrackedLink href={clinic.phoneHref} event={EVENTS.CLICKED_PHONE} eventProps={{ location: "kontakt", therapist: "clinic" }} className="link">{clinic.phone}</TrackedLink>
                  </p>
                  <p>
                    Osteopat {hege.name.split(" ")[0]}:{" "}
                    <TrackedLink href={hege.phoneHref} event={EVENTS.CLICKED_PHONE} eventProps={{ location: "kontakt", therapist: "hege" }} className="link">{hege.phone}</TrackedLink>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="blob inline-flex size-12 shrink-0 items-center justify-center bg-mint-200 text-secondary"><Mail /></span>
                <div>
                  <h3 className="font-display text-lg font-bold">E-post</h3>
                  <TrackedLink href={`mailto:${clinic.email}`} event={EVENTS.CLICKED_EMAIL} eventProps={{ location: "kontakt", therapist: "clinic" }} className="link break-all">{clinic.email}</TrackedLink>
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

      <FysioCtaBand location="landing_bottom" />
    </>
  );
}
