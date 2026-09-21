import type { Metadata } from "next";
import Image from "next/image";
import { ArticleLayout, ExternalLink } from "@/components/ArticleLayout";

export const metadata: Metadata = {
  title: "Kvinnehelse",
  description:
    "Spesialisert fysioterapi for kvinnehelse, inkludert behandling relatert til graviditet, bekkenleddsmerter, og inkontinens.",
  alternates: { canonical: "/kvinnehelse" },
};

export default function Kvinnehelse() {
  return (
    <ArticleLayout
      slug="kvinnehelse"
      title="Kvinnehelse"
      lead="Fysioterapeuter med kompetanse innen kvinnehelse – helsefremmende, forebyggende og dokumenterte tiltak."
      field="Allmenn fysioterapi"
    >
      <p>
        Kvinnehelse er en samlebetegnelse på sykdommer og helseproblemer som er spesifikke for kvinner.
        Det er et solid evidensgrunnlag for at fysioterapeuter innehar en fagkompetanse som kan hjelpe
        kvinner som rammes av ulike lidelser knyttet til dem.
      </p>
      <p>
        Føyka Fysioterapi og Osteopati tilbyr helsefremmende, forebyggende og dokumenterte
        fysioterapitiltak. Fysioterapeuten vil utføre en grundig undersøkelse der hele mennesket, og
        ikke bare symptomene, vil gi grunnlag for valg av behandling.
      </p>

      <h2>Instituttet kan hjelpe deg med</h2>
      <div className="grid items-start gap-6 sm:grid-cols-[1fr_11rem]">
        <ul className="grid list-disc gap-2.5 pl-5 marker:text-primary">
          <li>Behandling relatert til graviditet, fødsel og barseltid</li>
          <li>Behandling relatert til <ExternalLink href="https://bekkenleddhelse.no/">bekkenleddssmerter</ExternalLink></li>
          <li>
            Behandling relatert til inkontinens og underlivsprolaps (
            <ExternalLink href="https://www.facebook.com/share/tD4SRdxm6qkzZRR4/?mibextid=WC7FNe">les mer om inkontinens her</ExternalLink>)
          </li>
          <li>Behandling relatert til smerter i <ExternalLink href="https://vulva.no/">underlivet og seksuell dysfunksjon</ExternalLink></li>
          <li>Behandling relatert til osteoporose</li>
          <li>Behandling relatert til <ExternalLink href="https://endometriose.no/">endometriose og adenomyose</ExternalLink></li>
          <li>Behandling relatert til smertelindring</li>
          <li>Behandling relatert til rectus diastase</li>
        </ul>
        <Image
          src="/images/kvinnehelse.jpg"
          alt=""
          width={352}
          height={500}
          sizes="176px"
          className="hidden rounded-[2rem] sm:block"
        />
      </div>

      <p className="mt-8">
        Ved behov kan terapeuten rekvirere hjelpemidler fra firmaet{" "}
        <ExternalLink href="https://quintet.no/">Quintet</ExternalLink>. De har rammeavtale med Norske
        Helseforetak og NAV, som gjør at flere av produktene deres kan rekvireres kostnadsfritt. De har
        spesialisert seg på hjelpemidler innen inkontinens, smertelindring og seksuell helse.
      </p>
    </ArticleLayout>
  );
}
