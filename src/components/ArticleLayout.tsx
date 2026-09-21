import { BookingButton } from "@/components/BookingButton";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { TrackPageView } from "@/components/analytics/TrackView";
import { Phone } from "@/components/Icons";
import { FysioCtaBand } from "@/components/Sections";
import { EVENTS } from "@/lib/analytics";
import { breadcrumbJsonLd } from "@/lib/seo";
import { clinic, therapists } from "@/lib/site";

/**
 * Layout for the municipal physiotherapy articles. Informational first:
 * calm sidebar with "how to get an appointment", and only a soft cross-link to the private offer.
 */
export function ArticleLayout({
  slug,
  title,
  lead,
  field,
  children,
}: {
  slug: string;
  title: string;
  lead: string;
  /** Matches Therapist.fields to list who offers this treatment */
  field: string;
  children: React.ReactNode;
}) {
  const who = therapists.filter((t) => t.agreement === "kommunal" && t.fields.includes(field));
  return (
    <>
      <TrackPageView event={EVENTS.VIEWED_ARTICLE} eventProps={{ article: slug }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(title, `/${slug}`)) }} />

      <section className="relative overflow-hidden">
        <div aria-hidden className="blob absolute -top-40 -right-32 size-[32rem] bg-mint-200/60" />
        <div className="container-page relative pt-10 pb-10 lg:pt-16">
          <span className="chip bg-mint-200 text-ink">Kommunal avtale · kun egenandel</span>
          <h1 className="h1 mt-4 max-w-3xl">{title}</h1>
          <p className="lead mt-5 max-w-2xl">{lead}</p>
        </div>
      </section>

      <div className="container-page grid gap-10 lg:grid-cols-[1fr_22rem]">
        <article className="prose-ff min-w-0 max-w-[68ch]">{children}</article>

        <aside className="grid content-start gap-5 lg:sticky lg:top-32 lg:self-start">
          <div className="card">
            <h2 className="font-display text-xl font-extrabold">Slik får du time</h2>
            <p className="mt-2 text-[0.95rem]">
              Du trenger ikke henvisning. Du betaler kun egenandel, og frikort gjelder.
            </p>
            <ul className="mt-4 grid gap-3">
              {who.map((t) => (
                <li key={t.id} className="rounded-2xl bg-mint-50 p-3.5">
                  <p className="font-display font-bold text-secondary">{t.name}</p>
                  <TrackedLink href={t.phoneHref} event={EVENTS.CLICKED_PHONE} eventProps={{ location: "article_sidebar", therapist: t.id }} className="link flex items-center gap-1.5 text-[0.95rem]">
                    <Phone width={15} height={15} /> {t.phone}
                  </TrackedLink>
                  <TrackedLink href={`mailto:${t.email}`} event={EVENTS.CLICKED_EMAIL} eventProps={{ location: "article_sidebar", therapist: t.id }} className="link text-[0.95rem] break-all">
                    {t.email}
                  </TrackedLink>
                </li>
              ))}
            </ul>
            <TrackedLink href={clinic.phoneHref} event={EVENTS.CLICKED_PHONE} eventProps={{ location: "article_sidebar", therapist: "clinic" }} className="btn btn-dark mt-4 w-full">
              <Phone /> {clinic.phone}
            </TrackedLink>
          </div>
          <div className="rounded-[2rem] bg-mint-100 p-6">
            <h2 className="font-display text-lg font-extrabold">Trenger du time raskt?</h2>
            <p className="mt-1.5 text-[0.95rem]">
              Vår privatpraktiserende osteopat har kort ventetid. Fullbetalt tilbud – frikort gjelder ikke.
            </p>
            <BookingButton location="article_sidebar" className="mt-4 w-full" label="Bestill hos osteopat" />
          </div>
        </aside>
      </div>

      <FysioCtaBand location={`article_bottom_${slug}`} />
    </>
  );
}

export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <TrackedLink href={href} target="_blank" event={EVENTS.CLICKED_OUTBOUND_LINK} eventProps={{ location: "article" }}>
      {children}
      <span className="sr-only"> (åpnes i ny fane)</span>
    </TrackedLink>
  );
}
