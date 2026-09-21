import Image from "next/image";
import { BookingButton } from "@/components/BookingButton";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Mail, Phone } from "@/components/Icons";
import { EVENTS } from "@/lib/analytics";
import type { Therapist } from "@/lib/site";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2);

export function TherapistPortrait({ t, className = "" }: { t: Therapist; className?: string }) {
  return (
    <div className={`blob relative aspect-square overflow-hidden bg-mint-200 ${className}`}>
      {t.image ? (
        <Image src={t.image} alt={`Portrett av ${t.name}`} fill sizes="(min-width: 1024px) 260px, 60vw" className="object-cover" />
      ) : (
        // Placeholder until a portrait is available
        <div role="img" aria-label={t.name} className="flex size-full items-center justify-center bg-gradient-to-br from-primary to-ink">
          <span aria-hidden className="font-display text-6xl font-black text-white/90">{initials(t.name)}</span>
        </div>
      )}
    </div>
  );
}

export function TherapistCard({ t, location }: { t: Therapist; location: string }) {
  const isPrivate = t.agreement === "privat";
  const [local, domain] = t.email.split("@");
  return (
    <li className="card flex flex-col">
      <TherapistPortrait t={t} className="mx-auto w-44" />
      <div className="mt-5 flex-1 text-center">
        <span className={`chip ${isPrivate ? "bg-secondary text-white" : "bg-mint-200 text-ink"}`}>
          {isPrivate ? "Privat · time raskt" : "Driftsavtale"}
        </span>
        <h3 className="mt-3 font-display text-2xl font-extrabold">{t.name}</h3>
        <p className="font-semibold">
          {t.title}
          {t.qualifications.length > 0 && <span className="font-normal"> · {t.qualifications.join(", ")}</span>}
        </p>
        <ul className="mt-3 text-[0.95rem]">
          {t.fields.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      <div className="mt-5 grid gap-2 text-[0.95rem]">
        {isPrivate && <BookingButton location={`${location}_therapist_card`} label="Bestill time" className="mb-1 w-full" />}
        <TrackedLink
          href={t.phoneHref}
          event={EVENTS.CLICKED_PHONE}
          eventProps={{ location, therapist: t.id }}
          className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-mint-100 px-4 font-semibold text-secondary hover:bg-mint-200"
        >
          <Phone width={18} height={18} /> {t.phone}
        </TrackedLink>
        <TrackedLink
          href={`mailto:${t.email}`}
          event={EVENTS.CLICKED_EMAIL}
          eventProps={{ location, therapist: t.id }}
          className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-mint-100 px-3 text-[0.85rem] font-semibold text-secondary hover:bg-mint-200"
        >
          <Mail width={18} height={18} className="shrink-0" />
          {/* Only allow a line break after the @, never mid-word */}
          <span className="min-w-0 text-center leading-tight">
            {local}@<wbr />
            {domain}
          </span>
        </TrackedLink>
      </div>
    </li>
  );
}
