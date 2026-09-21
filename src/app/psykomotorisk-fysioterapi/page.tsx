import type { Metadata } from "next";
import { ArticleLayout } from "@/components/ArticleLayout";
import { LazyEmbed } from "@/components/LazyEmbed";

export const metadata: Metadata = {
  title: "Psykomotorisk fysioterapi",
  description:
    "Psykomotorisk fysioterapi retter seg mot bevisstgjøring og endring av spenningstilstander i kroppen.",
  alternates: { canonical: "/psykomotorisk-fysioterapi" },
};

export default function Psykomotorisk() {
  return (
    <ArticleLayout
      slug="psykomotorisk-fysioterapi"
      title="Psykomotorisk fysioterapi"
      lead="Psykomotorisk fysioterapi (PMF) handler om sammenhengen mellom kropp, følelser og livserfaringer."
      field="Psykomotorisk fysioterapi"
    >
      <p>
        Fysioterapeuter med psykomotorisk kompetanse har inngående kunnskap om ulike former for
        muskel/skjelett-lidelser, psykiske lidelser og sammensatte lidelser av ulik alvorlighetsgrad.
        Dette gir grunnlag for en helhetlig undersøkelse, ressursvurdering og behandlingstilnærming.
      </p>

      <div className="my-8">
        <LazyEmbed
          src="https://www.youtube-nocookie.com/embed/QP53IfuxnC4"
          title="Video: Hva er psykomotorisk fysioterapi?"
        />
      </div>

      <p>
        Med utgangspunkt i funksjonsundersøkelsen og pasientens behov benyttes ulike fysioterapeutiske
        tilnærminger og metoder i det kliniske arbeidet. PMF har som mål å være hjelp til selvhjelp.
        Behandlingen kan være individuell eller i gruppe.
      </p>
      <p>
        PMF bygger på kunnskap om hvordan pust og spenningstilstander i muskulatur kan endres ut fra
        hvordan vi har det med oss selv, og i relasjon til andre. Stress, bekymringer, konflikter,
        traumatiske opplevelser og livsbelastninger virker inn på vår kropp og kroppsopplevelse.
        Vedvarende spenningsmønster kan låse seg over tid, og gi smerter i muskler og skjelett, eller
        andre plager.
      </p>
      <p>
        PMF retter seg mot bevisstgjøring og endring av spenningstilstandene i kroppen, og kan gi økt
        fortrolighet og kontakt med egen kropp.
      </p>
    </ArticleLayout>
  );
}
