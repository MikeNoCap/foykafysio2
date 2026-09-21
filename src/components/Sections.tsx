import { BookingButton } from "@/components/BookingButton";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { ArrowRight, Check, Mail, Message, Phone } from "@/components/Icons";
import { EVENTS } from "@/lib/analytics";
import { HAS_ONLINE_BOOKING, hege } from "@/lib/site";

export function CheckList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="grid gap-2.5">
      {items.map((i) => (
        <li key={i} className="flex gap-3">
          <span className={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full ${dark ? "bg-primary text-secondary" : "bg-mint-200 text-secondary"}`}>
            <Check width={15} height={15} strokeWidth={3} />
          </span>
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

/** Direct contact options for Hege: the fallback (and complement) to online booking. */
export function HegeContactOptions({ location, dark = false }: { location: string; dark?: boolean }) {
  const cls = dark ? "btn btn-outline-light" : "btn btn-outline";
  return (
    <div className="flex flex-wrap gap-2.5">
      <TrackedLink href={hege.phoneHref} event={EVENTS.CLICKED_PHONE} eventProps={{ location, therapist: "hege" }} className={cls}>
        <Phone /> Ring {hege.phone}
      </TrackedLink>
      <TrackedLink href={`sms:+4797080097`} event={EVENTS.CLICKED_SMS} eventProps={{ location, therapist: "hege" }} className={cls}>
        <Message /> Send SMS
      </TrackedLink>
      <TrackedLink href={`mailto:${hege.email}?subject=${encodeURIComponent("Timebestilling osteopati")}`} event={EVENTS.CLICKED_EMAIL} eventProps={{ location, therapist: "hege" }} className={cls}>
        <Mail /> E-post
      </TrackedLink>
    </div>
  );
}

/** Dark closing band with the main booking CTA. Used at the bottom of funnel pages. */
export function BookingCtaBand({
  location,
  service = "osteopati",
  title = "Klar for å bli kvitt plagene?",
  text = "Osteopat Hege Wang tilbyr time raskt. Du trenger ingen henvisning.",
}: {
  location: string;
  service?: "osteopati" | "ultralyd";
  title?: string;
  text?: string;
}) {
  return (
    <section className="container-page mt-20">
      <div className="on-dark relative overflow-hidden rounded-[2.5rem] bg-secondary px-6 py-14 text-center text-white sm:px-12">
        <div aria-hidden className="blob absolute -top-24 -left-20 size-72 bg-primary/25" />
        <div aria-hidden className="blob-2 absolute -right-16 -bottom-28 size-80 bg-ink/70" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="h2 text-white">{title}</h2>
          <p className="lead mt-4 text-white/85">{text}</p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <BookingButton location={location} service={service} size="lg" label={HAS_ONLINE_BOOKING ? "Bestill time på nett" : "Bestill time hos osteopat"} />
            <HegeContactOptions location={location} dark />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Calm closing block for the municipal (informational) pages. */
export function FysioCtaBand({ location }: { location: string }) {
  return (
    <section className="container-page mt-20">
      <div className="rounded-[2.5rem] bg-mint-100 px-6 py-12 text-center sm:px-12">
        <h2 className="h2">Klar for å ta første steg?</h2>
        <p className="lead mx-auto mt-3 max-w-2xl">
          Ta kontakt med oss for å bestille time. Fysioterapeutene våre har kommunal avtale – du betaler kun egenandel, og frikort gjelder.
        </p>
        <TrackedLink
          href="/bestill-time#fysioterapi"
          event={EVENTS.CLICKED_BOOKING_FYSIOTERAPI}
          eventProps={{ location }}
          className="btn btn-dark mt-7"
        >
          Slik bestiller du time <ArrowRight />
        </TrackedLink>
      </div>
    </section>
  );
}
