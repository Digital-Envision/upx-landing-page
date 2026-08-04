import type { LandingPageContent } from "@/lib/landing/content";
import { NAV_CTA_LABEL } from "@/lib/landing/content";
import { LandingNavbar } from "./navbar";
import { LandingFooter } from "./footer";
import { LandingHero } from "./hero";
import {
  ChallengeSection,
  ClientLogos,
  CtaBand,
  OfferSection,
  ProcessSection,
  SolutionSection,
  StatsSection,
} from "./sections";
import { CaseStudySection } from "./case-study";
import { FaqSection } from "./faq";
import { ContactSection } from "./contact-section";

/**
 * The shared 13-section skeleton every service landing page in the Figma file
 * uses. Everything variable comes from `content`.
 */
export function LandingPage({ content }: { content: LandingPageContent }) {
  // The offer grid's anchor differs per page ("Engagement models" vs
  // "Available roles" vs "What we can build") — take it from the nav link.
  const offerAnchor = content.nav[1]?.href.replace("#", "") ?? "offer";

  return (
    <>
      <LandingNavbar links={content.nav} cta={{ href: content.cta.href, label: NAV_CTA_LABEL }} />
      <main>
        <LandingHero content={content} />
        <ClientLogos />
        <ChallengeSection content={content.challenge} />
        <CtaBand content={content.ctaBand} cta={content.cta} />
        <SolutionSection content={content.solution} />
        <OfferSection content={content.offer} id={offerAnchor} />
        <StatsSection content={content.stats} />
        <ProcessSection content={content.process} />
        <CaseStudySection content={content.caseStudy} />
        <FaqSection items={content.faq} />
        <ContactSection content={content} />
      </main>
      <LandingFooter />
    </>
  );
}
