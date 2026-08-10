import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import ClarityProvider from "@/components/clarity-provider";
import { GTM_ID } from "@/lib/analytics";
import "./globals.css";

// Typefaces are declared per route group — see app/(marketing)/layout.tsx and
// app/(landing)/layout.tsx — so each route only preloads the font it renders in.

export const metadata: Metadata = {
  title: "Upscalix – Your Dedicated Dev Team in Indonesia",
  description:
    "Scale your business with top-tier offshore developers from Indonesia. Upscalix provides dedicated senior engineering teams, project management, and QA — all managed from Melbourne.",
  keywords: [
    "offshore developers",
    "Indonesia developers",
    "dedicated dev team",
    "outsourced development",
    "Melbourne",
    "Upscalix",
    "remote engineering team",
    "software development outsourcing",
    "Australian tech company",
  ],
  authors: [{ name: "Upscalix", url: "https://upscalix.com.au" }],
  creator: "Upscalix",
  metadataBase: new URL("https://upscalix.com.au"),
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://upscalix.com.au",
    siteName: "Upscalix",
    title: "Upscalix – Your Dedicated Dev Team in Indonesia",
    description:
      "A fullstack senior dev team for the price of one local engineer. Scale your tech team with battle-tested engineers from Indonesia.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Upscalix – Your Dedicated Dev Team in Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upscalix – Your Dedicated Dev Team in Indonesia",
    description:
      "A fullstack senior dev team for the price of one local engineer.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://upscalix.com.au",
  },
};

// Static structured data — safe to serialize as it contains no user input
const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Upscalix",
  url: "https://upscalix.com.au",
  logo: "https://upscalix.com.au/logo.webp",
  description:
    "Dedicated senior engineering teams from Indonesia, managed from Melbourne.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Level 11, 580 Collins Street",
    addressLocality: "Melbourne",
    addressRegion: "VIC",
    postalCode: "3000",
    addressCountry: "AU",
  },
  sameAs: [
    "https://linkedin.com/company/upscalix",
    "https://x.com/upscalix",
    "https://github.com/upscalix",
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* GTM lives in the root layout so both route groups — the marketing
          homepage and the service landing pages — are covered by one container. */}
      {GTM_ID ? <GoogleTagManager gtmId={GTM_ID} /> : null}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      </head>
      <body className="antialiased">
        <ClarityProvider />
        {children}
      </body>
    </html>
  );
}
