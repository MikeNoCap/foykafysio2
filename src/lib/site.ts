/**
 * Single source of truth for clinic facts: contact info, therapists, prices.
 * Content is migrated from the old site + notat.txt. Edit here, not in pages.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://foykafysio.no"
).replace(/\/$/, "");

/** Hege's online booking (Physica). Override with NEXT_PUBLIC_HEGE_BOOKING_URL. Empty -> CTAs fall back to the booking page. */
export const HEGE_BOOKING_URL =
  process.env.NEXT_PUBLIC_HEGE_BOOKING_URL ||
  "https://system.physica.no/book/asker-osteopatiske-klinikk-as";
export const HAS_ONLINE_BOOKING = HEGE_BOOKING_URL.length > 0;
export const HEGE_BOOKING_HREF = HAS_ONLINE_BOOKING
  ? HEGE_BOOKING_URL
  : "/bestill-time#osteopat";

export const clinic = {
  name: "Føyka Fysioterapi og Osteopati",
  shortName: "Føyka",
  tagline: "Din partner for bedre helse og bevegelse i Asker",
  description:
    "Fysikalsk institutt i Asker sentrum med driftsavtale med Asker kommune. Allmenn fysioterapi, psykomotorisk fysioterapi og kvinnehelse – du betaler kun egenandel. Vi har også privat osteopat.",
  street: "Erteløkka 1",
  postalCode: "1384",
  city: "Asker",
  addressNote: "NB! Inngang fra parkeringshuset",
  phone: "66 78 04 11",
  phoneHref: "tel:+4766780411",
  email: "kontakt@foykafysio.no",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Ertel%C3%B8kka%201%2C%201384%20Asker",
  mapsEmbedUrl:
    "https://maps.google.com/maps?hl=no&q=Ertel%C3%B8kka%201,%201384%20Asker&z=15&output=embed",
} as const;

export type Therapist = {
  id: string;
  name: string;
  title: string;
  fields: string[];
  qualifications: string[];
  email: string;
  phone: string;
  phoneHref: string;
  image?: string;
  /** "privat" = full pay (Hege). "kommunal" = municipal agreement. */
  agreement: "privat" | "kommunal";
};

export const therapists: Therapist[] = [
  {
    id: "hege",
    name: "Hege Wang",
    title: "Osteopat og fysioterapeut",
    fields: ["Osteopati", "Ultralydundersøkelse", "Allmenn fysioterapi"],
    qualifications: [],
    email: "hege@askerok.no",
    phone: "970 80 097",
    phoneHref: "tel:+4797080097",
    agreement: "privat",
  },
  {
    id: "katrine",
    name: "Katrine Øydvin",
    title: "Fysioterapeut",
    fields: ["Allmenn fysioterapi", "Psykomotorisk fysioterapi"],
    qualifications: ["MSc", "MNFF"],
    email: "katrine@foykafysio.no",
    phone: "918 54 481",
    phoneHref: "tel:+4791854481",
    image: "/images/katrine-oydvin.jpg",
    agreement: "kommunal",
  },
  {
    id: "sam",
    name: "Sam Blankson",
    title: "Fysioterapeut",
    fields: ["Allmenn fysioterapi"],
    qualifications: [],
    email: "sam@foykafysio.no",
    phone: "950 13 581",
    phoneHref: "tel:+4795013581",
    image: "/images/sam-blankson.jpg",
    agreement: "kommunal",
  },
  {
    id: "havard",
    name: "Håvard Fagervik",
    title: "Psykomotorisk fysioterapeut",
    fields: ["Psykomotorisk fysioterapi"],
    qualifications: [],
    email: "havard@foykafysio.no",
    phone: "66 78 04 11",
    phoneHref: "tel:+4766780411",
    agreement: "kommunal",
  },
];

export const hege = therapists[0];

export type Price = {
  id: string;
  label: string;
  detail?: string;
  price: number;
  group: "osteopati" | "ultralyd";
};

/** Private prices (Hege). Frikort does not apply. Source: notat.txt */
export const prices: Price[] = [
  {
    id: "konsultasjon",
    label: "Konsultasjon",
    detail: "Undersøkelse og behandling",
    price: 1200,
    group: "osteopati",
  },
  {
    id: "behandling",
    label: "Behandling",
    detail: "Oppfølgende behandling",
    price: 800,
    group: "osteopati",
  },
  {
    id: "ultralyd-60",
    label: "Ultralydundersøkelse",
    detail: "60 minutter",
    price: 1500,
    group: "ultralyd",
  },
  {
    id: "ultralyd-30",
    label: "Ultralydundersøkelse",
    detail: "30 minutter",
    price: 1100,
    group: "ultralyd",
  },
  {
    id: "ultralyd-tillegg",
    label: "Ultralyd som tillegg",
    detail: "Ved senere konsultasjoner",
    price: 300,
    group: "ultralyd",
  },
];

export const formatPrice = (n: number) => `${n},-`;

export const mainNav = [
  { label: "Fysioterapi", href: "/allmenn-fysioterapi" },
  { label: "Psykomotorisk", href: "/psykomotorisk-fysioterapi" },
  { label: "Kvinnehelse", href: "/kvinnehelse" },
  { label: "Osteopati", href: "/osteopati" },
  { label: "Behandlere", href: "/#behandlerne" },
  { label: "Kontakt", href: "/#kontakt-oss" },
] as const;

/** Order matters: the clinic is primarily a physiotherapy institute (municipal agreement). */
export const services = [
  {
    href: "/allmenn-fysioterapi",
    title: "Allmenn fysioterapi",
    text: "Undersøkelse, behandling og forebygging av skader og plager i muskler og skjelett – for alle aldre.",
    badge: "Driftsavtale · kun egenandel",
    agreement: "kommunal",
  },
  {
    href: "/psykomotorisk-fysioterapi",
    title: "Psykomotorisk fysioterapi",
    text: "Forståelse av sammenhengen mellom kropp, følelser og livserfaringer.",
    badge: "Driftsavtale · kun egenandel",
    agreement: "kommunal",
  },
  {
    href: "/kvinnehelse",
    title: "Kvinnehelse",
    text: "Spesialisert behandling for plager knyttet til svangerskap og bekkenbunn.",
    badge: "Driftsavtale · kun egenandel",
    agreement: "kommunal",
  },
  {
    href: "/osteopati",
    title: "Osteopati",
    text: "Helhetlig, manuell undersøkelse og behandling. Privat tilbud med time raskt.",
    badge: "Privat · time raskt",
    agreement: "privat",
  },
  {
    href: "/ultralyd",
    title: "Ultralydundersøkelse",
    text: "Ultralyd av muskler, sener og ledd som del av en grundig undersøkelse.",
    badge: "Privat · time raskt",
    agreement: "privat",
  },
] as const;
