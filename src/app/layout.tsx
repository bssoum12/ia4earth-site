import type { Metadata, Viewport } from "next";
import { Noto_Kufi_Arabic, Sora, Unbounded } from "next/font/google";
import "./globals.css";
import "./effects.css";
import "./mobile.css";

const unbounded = Unbounded({ subsets: ["latin"], weight: ["400", "600", "800"], variable: "--f-unbounded", display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--f-sora", display: "swap" });
const kufi = Noto_Kufi_Arabic({ subsets: ["arabic"], weight: ["500", "700"], variable: "--f-kufi", display: "swap" });

const TITLE = "IA4EARTH, 3e édition | Salon de l'économie verte, 5–6 novembre 2026, Tunis";
const DESCRIPTION =
  "Innover pour un monde durable : l'intelligence artificielle au service de la transition écologique. 5–6 novembre 2026, Centre International des Congrès (UTICA), Tunis.";

export const metadata: Metadata = {
  metadataBase: new URL("https://salondedeveloppementdurable.com"),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_TN",
    url: "/",
    siteName: "IA4EARTH",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: "#02130f",
  colorScheme: "dark",
  viewportFit: "cover",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "IA4EARTH, 3e édition du Salon de l'économie verte, finance responsable et développement durable",
  description: "Innover pour un monde durable : l'intelligence artificielle au service de la transition écologique.",
  startDate: "2026-11-05",
  endDate: "2026-11-06",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Centre International des Congrès, siège de l'UTICA",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rue Ferjani Belhaj Ammar, n°4",
      postalCode: "1003",
      addressLocality: "Tunis",
      addressCountry: "TN",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${unbounded.variable} ${sora.variable} ${kufi.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </body>
    </html>
  );
}
