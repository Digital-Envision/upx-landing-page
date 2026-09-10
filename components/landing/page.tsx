import type {
  FigmaLandingPage,
  HouseLandingPage,
  LandingPageContent,
} from "@/lib/landing/content";
import { NAV_CTA_LABEL } from "@/lib/landing/content";
import { LandingNavbar } from "./navbar";
import { LandingFooter } from "./footer";
import { FigmaLandingHero, LandingHero } from "./hero";
import {
  ChallengeSection,
  ClientLogos,
  CtaBand,
  ExpertiseSection,
  OfferSection,
  ProcessSection,
  SolutionSection,
  StatsSection,
} from "./sections";
import { CaseStudySection } from "./case-study";
import { ProjectsSection } from "./projects";
import { FaqSection } from "./faq";
import { ContactSection } from "./contact-section";

/** The offer grid is whatever the second nav link points at. */
function offerAnchor(content: LandingPageContent) {
  return content.nav[1]?.href.replace("#", "") ?? "offer";
}

/**
 * The skeleton the first three pages shipped with: a photographic hero, an
 * extra "Our solution" grid, and the case study held back until after the
 * process steps.
 */
function HouseLayout({ content }: { content: HouseLandingPage }) {
  return (
    <>
      <LandingHero content={content} />
      <ClientLogos />
      <ChallengeSection content={content.challenge} />
      <CtaBand content={content.ctaBand} cta={content.cta} />
      <SolutionSection content={content.solution} />
      <OfferSection content={content.offer} id={offerAnchor(content)} />
      <StatsSection content={content.stats} />
      <ProcessSection content={content.process} />
      <CaseStudySection content={content.caseStudy} />
      <FaqSection items={content.faq} />
    </>
  );
}

/**
 * The order the Figma frames run in: hero → logos → challenge → case study and
 * client work → CTA band → tech wall → stats → offer → process → FAQ.
 *
 * Page 4 differs twice over: it has no challenge list, so the offer grid leads
 * in its place, and it has no featured case study, so the projects row stands
 * alone under its own heading instead of sitting beneath the navy card.
 */
function FigmaLayout({ content }: { content: FigmaLandingPage }) {
  const anchor = offerAnchor(content);
  const offerLeads = !content.challenge;
  const offer = <OfferSection content={content.offer} id={anchor} />;

  return (
    <>
      <FigmaLandingHero content={content} />
      <ClientLogos />
      {content.challenge ? <ChallengeSection content={content.challenge} /> : offer}
      {content.caseStudy ? (
        <CaseStudySection content={content.caseStudy} projects={content.projects} />
      ) : content.projects ? (
        <ProjectsSection content={content.projects} />
      ) : null}
      <CtaBand content={content.ctaBand} cta={content.cta} />
      {content.expertise ? (
        <ExpertiseSection content={content.expertise} roles={content.roles} />
      ) : null}
      <StatsSection content={content.stats} />
      {offerLeads ? null : offer}
      <ProcessSection content={content.process} />
      <FaqSection items={content.faq} />
    </>
  );
}

/** Chrome and the enquiry form are identical across both layouts. */
export function LandingPage({ content }: { content: LandingPageContent }) {
  return (
    <>
      <LandingNavbar links={content.nav} cta={{ href: content.cta.href, label: NAV_CTA_LABEL }} />
      <main>
        {content.layout === "figma" ? (
          <FigmaLayout content={content} />
        ) : (
          <HouseLayout content={content} />
        )}
        <ContactSection content={content} />
      </main>
      <LandingFooter />
    </>
  );
}
