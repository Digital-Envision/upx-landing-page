import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/page";
import { LANDING_PAGES } from "@/lib/landing/content";
import { landingJsonLd, landingMetadata } from "@/lib/landing/seo";

const content = LANDING_PAGES["custom-software-development"];

export const metadata: Metadata = landingMetadata(content);

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: landingJsonLd(content) }}
      />
      <LandingPage content={content} />
    </>
  );
}
