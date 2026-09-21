import type { Metadata } from "next";
import { ArticleLayout, ExternalLink } from "@/components/ArticleLayout";
import { CheckList } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Allmenn fysioterapi",
  description:
    "Vi tilbyr allmenn fysioterapi for behandling og forebygging av skader og sykdommer i muskel- og skjelettsystemet.",
  alternates: { canonical: "/allmenn-fysioterapi" },
};

export default function Allmenn() {
  return (
    <ArticleLayout
      slug="allmenn-fysioterapi"
      title="Allmenn fysioterapi"
      lead="Fysioterapeuter jobber med kropp og bevegelse, og formålet er å fremme god helse."
      field="Allmenn fysioterapi"
    >
      <p>
        En allmenn fysioterapeut har inngående kunnskap og forståelse for hvordan man oppnår dette
        gjennom inngående kunnskap om menneskets fysiologi, anatomi og bevegelsesutvikling.
      </p>
      <p>
        Vi jobber med skader og sykdommer som gir smerter, ubehag eller nedsatt funksjon i muskel- og
        skjelettsystemet. Vår tilnærming er både behandlende og forebyggende. All behandling baserer seg
        på en grundig undersøkelse og anamnese som ender i en vurdering av ditt problem – i tett dialog
        med deg om hva du selv ønsker hjelp til.
      </p>
      <p>
        Målet med behandlingen er at du skal forbedre, gjenvinne eller opprettholde funksjonsevnen din.
        Vi utnytter dine egne ressurser, og målet er at du skal få kunnskap og forståelse for hvordan du
        selv kan bidra aktivt og ta ansvar for egen helse.
      </p>

      <h2>Noe av det vi hjelper med</h2>
      <CheckList
        items={[
          "Hodepine og migrene",
          "Svimmelhet",
          "Nakkeplager, prolaps, smerter og stivhet",
          "Ryggsmerter, isjias, lumbago og spinal stenose",
          "Artrose (vi er AktivA-terapeuter)",
          "Rehabilitering etter operasjoner",
          "Skulder- og albueplager (f.eks. tennisalbue)",
          "Kne-, hofte-, fot- og bekkenplager",
          "Idrettsskader",
          "Nevrologiske lidelser",
        ]}
      />
      <p className="mt-8">
        <ExternalLink href="https://fysio.no/hva-er-fysioterapi">Les mer om fysioterapi på fysio.no</ExternalLink>
      </p>
    </ArticleLayout>
  );
}
