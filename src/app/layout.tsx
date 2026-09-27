import type { Metadata, Viewport } from "next";
import { DM_Sans, Saira } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileBookingBar } from "@/components/MobileBookingBar";
import { NoticeBanner } from "@/components/NoticeBanner";
import { getContent } from "@/lib/content";
import { getClinicJsonLd } from "@/lib/seo";
import { clinic, SITE_URL } from "@/lib/site";

// Saira: squared, robust geometric sans – the closest open match to "Industry".
const heading = Saira({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${clinic.name} | Fysioterapi i Asker med driftsavtale`,
    template: `%s | ${clinic.name}`,
  },
  description: clinic.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: clinic.name,
    title: clinic.name,
    description: clinic.description,
    url: SITE_URL,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#023535" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = getContent();
  return (
    <html lang="nb" className={`${heading.variable} ${body.variable}`}>
      <body>
        <a
          href="#innhold"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-secondary focus:px-5 focus:py-3 focus:text-white"
        >
          Hopp til innhold
        </a>
        <PostHogProvider>
          <NoticeBanner notice={content.notice} />
          <Header phone={content.clinic.phone} phoneHref={content.clinic.phoneHref} email={content.clinic.email} />
          <main id="innhold">{children}</main>
          <Footer />
          <MobileBookingBar hege={{ name: content.hege.name, phoneHref: content.hege.phoneHref }} />
          <CookieConsent />
        </PostHogProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getClinicJsonLd()) }}
        />
      </body>
    </html>
  );
}
