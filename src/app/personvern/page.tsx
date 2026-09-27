import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { EmailText } from "@/components/ContactText";

export const metadata: Metadata = {
  title: "Personvern og informasjonskapsler",
  description: "Slik behandler Føyka Fysioterapi og Osteopati opplysninger om besøk på nettsiden.",
  alternates: { canonical: "/personvern" },
};

export default function Personvern() {
  const { clinic } = getContent();
  return (
    <div className="container-page pt-10 lg:pt-16">
      <h1 className="h1">Personvern og informasjons&shy;kapsler</h1>
      <div className="prose-ff mt-8 max-w-[68ch]">
        <p>
          Denne siden forklarer hvilke opplysninger som samles inn når du besøker nettsiden til {clinic.name}.
          Nettsiden samler ikke inn helseopplysninger.
        </p>
        <h2>Statistikk</h2>
        <p>
          Vi bruker analyseverktøyet PostHog (lagring i EU) for å forstå hvordan nettsiden brukes, for
          eksempel hvilke sider som besøkes og hvilke knapper som trykkes på. Uten samtykke lagres
          ingenting på enheten din, og besøket kan ikke kjennes igjen neste gang.
        </p>
        <h2>Informasjonskapsler</h2>
        <p>
          Dersom du velger «Godta», lagrer vi en informasjonskapsel slik at vi kan kjenne igjen
          gjentatte besøk og se anonymiserte opptak av hvordan siden brukes (alle skjemafelt er
          maskert). Du kan når som helst endre valget ditt via «Informasjonskapsler» nederst på siden.
        </p>
        <h2>Innebygd innhold</h2>
        <p>
          Sidene viser kart fra Google Maps og video fra YouTube. Disse tjenestene kan sette egne
          informasjonskapsler.
        </p>
        <h2>Kontakt</h2>
        <p>
          Spørsmål om personvern kan rettes til <a href={`mailto:${clinic.email}`}><EmailText>{clinic.email}</EmailText></a>.
          Ikke send sensitive helseopplysninger på e-post.
        </p>
      </div>
    </div>
  );
}
