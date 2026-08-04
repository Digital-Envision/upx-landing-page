import type { Metadata } from "next";
import type { LandingPageContent } from "./content";

const SITE = "https://upscalix.com.au";

export function landingMetadata(content: LandingPageContent): Metadata {
  const url = `${SITE}/${content.slug}`;
  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_AU",
      url,
      siteName: "Upscalix",
      title: content.meta.title,
      description: content.meta.description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: content.meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
      images: ["/og-image.png"],
    },
  };
}

/**
 * FAQPage structured data — the pages already render every question and answer
 * in the DOM, so this just makes the same content machine-readable.
 */
export function landingJsonLd(content: LandingPageContent): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  });
}
