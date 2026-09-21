import { clinic, formatPrice, prices, SITE_URL, therapists } from "@/lib/site";

export const clinicJsonLd = {
  "@context": "https://schema.org",
  "@type": ["MedicalClinic", "LocalBusiness"],
  "@id": `${SITE_URL}/#clinic`,
  name: clinic.name,
  description: clinic.description,
  url: SITE_URL,
  logo: `${SITE_URL}/logo/logo-horizontal.svg`,
  image: `${SITE_URL}/opengraph-image`,
  telephone: "+4766780411",
  email: clinic.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: clinic.street,
    postalCode: clinic.postalCode,
    addressLocality: clinic.city,
    addressCountry: "NO",
  },
  medicalSpecialty: ["Physiotherapy", "Osteopathic"],
  employee: therapists.map((t) => ({
    "@type": "Person",
    name: t.name,
    jobTitle: t.title,
  })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Osteopati og ultralyd (privat)",
    itemListElement: prices.map((p) => ({
      "@type": "Offer",
      name: [p.label, p.detail].filter(Boolean).join(" – "),
      price: p.price,
      priceCurrency: "NOK",
      description: formatPrice(p.price),
    })),
  },
};

export const faqJsonLd = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((i) => ({
    "@type": "Question",
    name: i.q,
    acceptedAnswer: { "@type": "Answer", text: i.a },
  })),
});

export const breadcrumbJsonLd = (title: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Forside", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}${path}` },
  ],
});
