import type { ComponentType, SVGProps } from "react";
import * as Icons from "@/components/landing/icons";
import { PiggyBankIcon } from "@/components/landing/figma-icons";

/**
 * Content model for the service landing pages (Figma file "Upscalix Landing
 * Pages"). The layout lives in components/landing/* and everything variable
 * lives here.
 *
 * There are two layouts. The first three pages shipped with a "house" layout —
 * a photographic hero plus an extra "Our solution" grid, neither of which the
 * Figma frames actually draw. Pages added since follow the frames literally
 * ("figma"): the enquiry form sits in the hero, there is no solution grid, and
 * the case study runs ahead of the CTA band.
 */

export type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export interface HeroStat {
  /** Large figure, e.g. "70%" */
  value: string;
  /** Two-line supporting label */
  label: string;
  icon: Icon;
}

export interface SolutionCard {
  icon: Icon;
  title: string;
  body: string;
}

/** The wide 3-up cards used by it-outsourcing's "Engagement models". */
export interface ModelCard {
  eyebrow: string;
  title: string;
  body: string;
  bestFit: string;
}

/** The compact icon tiles used by every page whose offer grid isn't the model cards. */
export interface TileCard {
  icon: Icon;
  title: string;
}

export type OfferGrid =
  | { kind: "models"; items: ModelCard[] }
  | { kind: "tiles"; columns: 3 | 4; items: TileCard[] };

export interface Faq {
  question: string;
  answer: string;
}

/** The numbered problem list shared by pages 1-3. */
export interface ChallengeContent {
  eyebrow: string;
  heading: string;
  body: string;
  items: string[];
}

/** The six-card "Our solution" grid — house layout only; not in the Figma frames. */
export interface SolutionContent {
  eyebrow: string;
  heading: string;
  body: string;
  cards: SolutionCard[];
}

/**
 * The tech-logo wall on page 4. These are third-party brand marks exported
 * from the Figma frame and committed under /public/landing/tech.
 */
export interface ExpertiseContent {
  heading: string;
  logos: { src: string; alt: string; width: number; height: number }[];
  /** Sits in the last two cells of the grid, not underneath it. */
  note: string;
}

/** Page 4's "Roles We Support" card row. */
export interface RolesContent {
  heading: string;
  items: string[];
}

/** One piece of client work in the projects row. */
export interface ProjectCard {
  name: string;
  blurb: string;
  /** Device mockup exported from the frame, shown on a tinted panel. */
  image: string;
  /** "Learn more" target. */
  href: string;
}

/**
 * The row of client work. Pages 1 and 3 run it straight under the featured case
 * study with no heading of its own; page 4 has no case study at all and gives
 * the row a full section header in its place.
 */
export interface ProjectsContent {
  eyebrow?: string;
  heading?: string;
  body?: string;
  items: ProjectCard[];
}

/** The navy featured-case-study card. */
export interface CaseStudyContent {
  heading: string;
  challenge: string;
  solution: string;
  impact: string;
  metric: { value: string; label: string };
  thumbnail: string;
  /** "Learn more" target; the button is omitted when there is none. */
  href?: string;
}

/** Everything both layouts carry. */
interface BaseLandingPage {
  slug: string;
  meta: { title: string; description: string };
  nav: { label: string; href: string }[];
  cta: { label: string; href: string };
  ctaBand: { heading: string; body: string };
  offer: {
    eyebrow: string;
    heading: string;
    body: string;
    grid: OfferGrid;
    /**
     * Anchor for the section. Held here rather than read back out of `nav`,
     * because a page can drop its nav — the frames for the newer pages have
     * none — without its sections losing their ids.
     */
    id: string;
  };
  stats: { eyebrow: string; heading: string; items: { value: string; label: string }[] };
  process: {
    eyebrow: string;
    heading: string;
    body: string;
    steps: string[];
  };
  faq: Faq[];
  form: {
    heading: string;
    body: string;
    /**
     * Extra field beyond name/email/company/details, when the design has one.
     * `icon` is a key rather than a component: the form is a Client Component,
     * and function props can't cross that boundary.
     */
    extraField?: { name: string; label: string; icon: "userGroup" };
    detailsLabel: string;
  };
}

/** it-outsourcing, offshore-developers, custom-software-development. */
export interface HouseLandingPage extends BaseLandingPage {
  layout: "house";
  hero: {
    /** Each page arranges the floating pills differently; see LandingHero. */
    variant: "a" | "b" | "c";
    eyebrow: string;
    heading: string;
    body: string;
    image: { src: string; alt: string; width: number; height: number };
    /**
     * Second photograph sitting behind the cut-out. Only offshore-developers
     * has one — the other pages use a flat blue panel or no backdrop at all.
     */
    backdrop?: { src: string; width: number; height: number };
    /** Rendered as a dark pill floating over the hero artwork. */
    stat: HeroStat;
    /** Optional second, light pill. Page 1 and 2 show the team avatars. */
    teamPill?: string;
    /** Circular navy medallion over the artwork. */
    badge?: { kind: "image" } | { kind: "icon"; icon: Icon };
  };
  challenge: ChallengeContent;
  solution: SolutionContent;
  caseStudy: CaseStudyContent;
}

/** dedicated-development-teams, mobile-app-development. */
export interface FigmaLandingPage extends BaseLandingPage {
  layout: "figma";
  /** No artwork: the frame puts the enquiry form where the photo would go. */
  hero: { eyebrow: string; heading: string; body: string };
  /** Absent on pages that lead with the offer grid instead (page 4). */
  challenge?: ChallengeContent;
  /** Page 4 drops the featured case study and shows only the projects row. */
  caseStudy?: CaseStudyContent;
  projects?: ProjectsContent;
  expertise?: ExpertiseContent;
  roles?: RolesContent;
}

export type LandingPageContent = HouseLandingPage | FigmaLandingPage;

const BOOKING_URL = "#contact";

/** Write-up of one piece of work on the main marketing site. */
const projectUrl = (slug: string) => `https://upscalix.com.au/project/${slug}`;

/**
 * Client work shown in the projects row. Three of the six appear on more than
 * one page, so they are declared once here.
 *
 * These stay PNG while the rest of the landing artwork is WebP, and must not be
 * "tidied up" into WebP: the mockups are transparent cut-outs, and Next's AVIF
 * encoder silently flattens alpha to black when the source is WebP — which puts
 * a black box behind every phone. A PNG source survives the same conversion.
 */
const PROJECTS = {
  crcCare: {
    name: "CRC Care",
    blurb:
      "CRC care is a partnership program in Australia that focuses on preventing and dealing with water, air, and soil contamination.",
    image: "/landing/projects/crc-care.png",
    href: projectUrl("crc-care"),
  },
  timeDriver: {
    name: "Time Driver",
    blurb:
      "Time Driver simplifies the gig economy, offering drivers freedom of choice. They can see destinations, select preferred jobs, and take control of their rideshare career.",
    image: "/landing/projects/time-driver.png",
    href: projectUrl("time-driver"),
  },
  jmax: {
    name: "JMAX",
    blurb:
      "JMAX Engineering is a custom metal fabrication, welding services, and repair located in Melbourne, Australia, serving business and resident needs.",
    image: "/landing/projects/jmax.png",
    href: projectUrl("jmax"),
  },
  consultnoteAi: {
    name: "Consultnote AI",
    blurb:
      "Consultnote AI sought to develop an AI for doctor consultations and patient recommendations based on consultation scripts.",
    image: "/landing/projects/consultnote-ai.png",
    href: projectUrl("consultnote-ai"),
  },
  frootMap: {
    name: "FrootMap",
    blurb:
      "FrootMap is a mobile app designed to connect local communities by enabling users to buy, sell, or donate fruits and vegetables to herbs and spices.",
    image: "/landing/projects/frootmap.png",
    href: projectUrl("frootmap"),
  },
  popScongs: {
    name: "Pop Scongs",
    blurb:
      "Pop Scongs is a singing app made by a vocal teacher to help her student learn to singing whenever and wherever they are.",
    image: "/landing/projects/pop-scongs.png",
    href: projectUrl("pop-scongs"),
  },
} satisfies Record<string, ProjectCard>;

/** Shared across every landing page — same client roster, same reassurances. */
export const TRUSTED_BY = "TRUSTED BY 40+ AUSTRALIAN BUSINESSES";

/**
 * The header button reads the same on every page, even though each page's own
 * primary CTA copy differs (that wording still drives the hero, the mid-page
 * band and the form's submit button).
 */
export const NAV_CTA_LABEL = "Book Free Consultation";

export const FORM_ASSURANCES = [
  "Free, no-obligation consultation",
  "Response within one business day",
  "100% confidential project details",
];

/** One video for every landing page, per the brief. */
export const SHOWCASE_VIDEO = {
  id: "36jD5ei5E88",
  title: "Upscalix — how we build dedicated development teams",
};

const itOutsourcing: HouseLandingPage = {
  layout: "house",
  slug: "it-outsourcing",
  meta: {
    title: "IT Outsourcing Australia | Dedicated Development Teams — Upscalix",
    description:
      "Build a dedicated software development team without local hiring delays. Upscalix helps Australian businesses scale engineering with dedicated offshore teams.",
  },
  nav: [
    { label: "OUR WORK", href: "#case-study" },
    { label: "ENGAGEMENT MODELS", href: "#engagement-models" },
    { label: "HOW WE WORK", href: "#process" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: { label: "Book Free Consultation", href: BOOKING_URL },
  hero: {
    variant: "a",
    eyebrow: "DEDICATED DEVELOPMENT TEAMS",
    heading: "Build Your Dedicated Development Team Without Local Hiring Delays",
    body: "Upscalix helps Australian businesses build dedicated software development teams that integrate seamlessly with your company, allowing you to scale faster while reducing hiring complexity.",
    image: {
      src: "/landing/hero-it-outsourcing.webp",
      alt: "An Upscalix software developer at work",
      // Exported from the Figma photo layer itself (node 7:773), not from its
      // underlying image fill — so the layer's crop and orientation are already
      // baked in and the file matches the frame's 349.974:319.541 ratio. That
      // makes the render a straight 1:1 fit: no crop, flip or scaling applied
      // here. (Figma flattens layer exports onto white, so the white surround
      // was keyed back out to restore the cut-out.)
      width: 800,
      height: 730,
    },
    stat: { value: "70%", label: "Cost savings\nvs. local hires", icon: PiggyBankIcon },
    teamPill: "40+ Teams Deployed",
    badge: { kind: "image" },
  },
  challenge: {
    eyebrow: "THE CHALLENGE",
    heading: "Hiring Software Developers Shouldn't Slow Your Business Down",
    body: "Finding experienced software developers locally has become increasingly difficult. Long recruitment cycles, rising hiring costs, and limited talent availability often delay projects and slow business growth.",
    items: [
      "Long recruitment process",
      "Rising hiring costs",
      "Limited local talent",
      "Difficult to scale engineering teams",
      "Delayed project delivery",
    ],
  },
  ctaBand: {
    heading: "Need to Scale Your Development Team?",
    body: "Book a free consultation and discover how Upscalix can help you build a dedicated development team.",
  },
  solution: {
    eyebrow: "OUR SOLUTION",
    heading: "A Dedicated Development Team Built Around Your Business",
    body: "Upscalix provides experienced software developers who work as an extension of your business, integrating with your team, processes, and tools.",
    cards: [
      {
        icon: Icons.IconoirDeveloperIcon,
        title: "Dedicated development team",
        body: "Engineers assigned to you full-time — not shared across projects.",
      },
      {
        icon: Icons.IconoirAxesIcon,
        title: "Flexible engagement model",
        body: "Scale from one developer to a full team as your roadmap changes.",
      },
      {
        icon: Icons.IconoirChatLinesIcon,
        title: "Direct communication",
        body: "Talk straight to your developers — no account-manager relay.",
      },
      {
        icon: Icons.IconoirTaskListIcon,
        title: "Transparent delivery",
        body: "Clear sprint visibility and reporting, no hidden fees.",
      },
      {
        icon: Icons.IconoirCalendarRotateIcon,
        title: "Long-term collaboration",
        body: "Average developer tenure built for multi-year partnerships.",
      },
      {
        icon: Icons.IconoirClockRotateRightIcon,
        title: "Faster team scaling",
        body: "Onboard new developers in weeks, not months.",
      },
    ],
  },
  offer: {
    id: "engagement-models",
    eyebrow: "ENGAGEMENT MODELS",
    heading: "Choose the Engagement Model that Fits Your Business",
    body: "Whether you need one developer or an entire software engineering team, Upscalix offers flexible engagement models tailored to your business objectives.",
    grid: {
      kind: "models",
      items: [
        {
          eyebrow: "MODEL 01",
          title: "Dedicated Team",
          body: "A full team — developers, QA, and a project lead — working exclusively on your product, integrated into your existing workflow.",
          bestFit: "ongoing product development",
        },
        {
          eyebrow: "MODEL 02",
          title: "Team Extension",
          body: "Add individual developers directly into your in-house team to cover a skills gap or free up your senior engineers.",
          bestFit: "scaling an existing team fast",
        },
        {
          eyebrow: "MODEL 03",
          title: "Project-Based Development",
          body: "A fixed-scope team delivers a defined project from spec to launch, with a dedicated project manager.",
          bestFit: "a scoped build with a fixed timeline",
        },
      ],
    },
  },
  stats: {
    eyebrow: "WHY UPSCALIX",
    heading: "Why Australian Businesses Choose Upscalix",
    items: [
      { value: "70%", label: "Cost savings\nvs. local hires" },
      { value: "<2%", label: "Developer churn rate" },
      { value: "5+ yrs", label: "Average developer experience" },
      { value: "90%", label: "Developers\nwith strong English" },
      { value: "40+", label: "Australian\nbusinesses trusted" },
    ],
  },
  process: {
    eyebrow: "HOW WE WORK",
    heading: "Our Engagement Process",
    body: "From first call to a fully onboarded team, here's the path every engagement follows.",
    steps: [
      "Discovery Call",
      "Requirement Analysis",
      "Talent Matching",
      "Interview & Selection",
      "Team Onboarding",
      "Continuous Delivery & Scaling",
    ],
  },
  caseStudy: {
    heading: "Helping an Australian Residential App Provider Scale Its Engineering Team",
    challenge:
      "Needed to scale engineering fast to keep pace with property-manager demand, without the cost or delay of local hiring.",
    solution:
      "Upscalix embedded a dedicated full-stack team directly into the client's existing workflow within weeks.",
    impact:
      "Faster release cycles and a platform built to support ongoing growth in resident engagement.",
    metric: {
      value: "90%",
      label:
        "Tenant engagement rate achieved on the platform, powered by Upscalix's full-stack offshore team",
    },
    thumbnail: "/landing/case-study-thumb.webp",
  },
  faq: [
    {
      question: "How quickly can we start?",
      answer:
        "Most engagements kick off within one to two weeks. We match your requirements against pre-vetted senior engineers, so there is no lengthy recruitment cycle to wait through.",
    },
    {
      question: "Can we interview developers?",
      answer:
        "Yes. You interview every developer before they join your team, and you make the final call on who comes on board.",
    },
    {
      question: "Can we scale the team later?",
      answer:
        "Yes — you can add or reduce developers as your roadmap changes, without renegotiating a new contract.",
    },
    {
      question: "How do you manage communication?",
      answer:
        "Your developers work in your tools — Slack, Teams, Jira, Linear — and join your standups directly. There is no account manager sitting between you and the engineers.",
    },
    {
      question: "What engagement models are available?",
      answer:
        "Three: a dedicated team working exclusively on your product, team extension where individual developers join your in-house team, and project-based delivery for a fixed scope and timeline.",
    },
    {
      question: "How is pricing structured?",
      answer:
        "A simple monthly rate per developer that covers salary, HR, payroll, equipment, and management. No recruitment fees and no hidden charges.",
    },
  ],
  form: {
    heading: "Let's Build Your Development Team",
    body: "Tell us about your project and we'll get back to you within one business day.",
    detailsLabel: "Project Details",
  },
};

const offshoreDevelopers: HouseLandingPage = {
  layout: "house",
  slug: "offshore-developers",
  meta: {
    title: "Hire Offshore Developers Australia | Dedicated Engineers — Upscalix",
    description:
      "Hire dedicated offshore software developers who work in your timezone, join your standups, and collaborate like an in-house team. Australian-managed, Indonesia-based.",
  },
  nav: [
    { label: "OUR WORK", href: "#case-study" },
    { label: "AVAILABLE ROLES", href: "#available-roles" },
    { label: "HOW WE WORK", href: "#process" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: { label: "Hire Offshore Developers", href: BOOKING_URL },
  hero: {
    variant: "b",
    eyebrow: "DEDICATED OFFSHORE DEVELOPERS",
    heading: "Hire Dedicated Offshore Developers That Feel Like Part of Your Team",
    body: "Scale your engineering capacity with experienced offshore software developers who work in your preferred timezone, integrate with your workflows, and collaborate like an in-house team.",
    image: {
      // Both layers are exported from their Figma layers (nodes 35:1418 and
      // 27:57), so each already carries the crop the design applies. The
      // cut-out's white surround was keyed back out to restore transparency.
      src: "/landing/hero-offshore-developers.webp",
      alt: "An Upscalix offshore developer on a call with an Australian client",
      width: 796,
      height: 648,
    },
    backdrop: { src: "/landing/hero-offshore-bg.webp", width: 796, height: 538 },
    stat: {
      value: "<2%",
      label: "Developer\nChurn Rate",
      icon: Icons.HugeiconsRefresh04Icon,
    },
    teamPill: "40+ Teams Deployed",
    badge: { kind: "image" },
  },
  challenge: {
    eyebrow: "THE CHALLENGE",
    heading: "Offshore Development Shouldn't Mean Compromising Quality",
    body: "Many businesses hesitate to build offshore teams because of concerns around communication, time zones, code quality, and team stability. Upscalix is built to solve those challenges through a dedicated collaboration model.",
    items: [
      "Communication barriers",
      "Timezone differences",
      "Inconsistent code quality",
      "Lack of ownership",
      "High developer turnover",
      "Difficult collaboration",
    ],
  },
  ctaBand: {
    heading: "Looking for Reliable Offshore Developers?",
    body: "Book a free consultation and discover how Upscalix can help you build a dedicated development team.",
  },
  solution: {
    eyebrow: "OUR SOLUTION",
    heading: "Dedicated Offshore Developers Who Work As Your Team",
    body: "Our developers integrate into your engineering team, participate in your daily workflows, and collaborate using your preferred tools and processes.",
    cards: [
      {
        icon: Icons.IconoirLaptopDevModeIcon,
        title: "Dedicated developers",
        body: "Engineers who work only for you — not shared across other client projects.",
      },
      {
        icon: Icons.IconoirChatLinesIcon,
        title: "Direct communication",
        body: "Talk straight to your developers — no account-manager relay.",
      },
      {
        icon: Icons.IconoirTimeZoneIcon,
        title: "Timezone alignment",
        body: "Your team works inside Australian business hours for real-time collaboration.",
      },
      {
        icon: Icons.IconoirScaleFrameEnlargeIcon,
        title: "Flexible scaling",
        body: "Add or reduce developers as your engineering needs change, without renegotiating contracts.",
      },
      {
        icon: Icons.IconoirCalendarRotateIcon,
        title: "Long-term collaboration",
        body: "Low turnover means the same developers stay with your project for years, not months.",
      },
      {
        icon: Icons.HugeiconsTextCheckIcon,
        title: "Transparent reporting",
        body: "Clear visibility into sprints, hours, and progress — no black-box outsourcing.",
      },
    ],
  },
  offer: {
    id: "available-roles",
    eyebrow: "AVAILABLE ROLES",
    heading: "Build The Team You Need",
    body: "Every role plugs directly into your existing team structure and workflow.",
    grid: {
      kind: "tiles",
      columns: 4,
      items: [
        { icon: Icons.HugeiconsDatabaseSettingIcon, title: "Backend Developers" },
        { icon: Icons.HugeiconsWebDesign01Icon, title: "Frontend Developers" },
        { icon: Icons.HugeiconsWebDesign02Icon, title: "Full Stack Developers" },
        { icon: Icons.HugeiconsMobileProgramming01Icon, title: "Mobile Developers" },
        { icon: Icons.HugeiconsComputerCheckIcon, title: "QA Engineers" },
        { icon: Icons.HugeiconsSourceCodeSquareIcon, title: "DevOps Engineers" },
        { icon: Icons.HugeiconsDashboardSquareEditIcon, title: "UI/UX Designers" },
        { icon: Icons.HugeiconsJobSearchIcon, title: "Business Analysts" },
      ],
    },
  },
  stats: {
    eyebrow: "WHY UPSCALIX",
    heading: "Why Companies Choose Upscalix",
    items: [
      { value: "100%", label: "Dedicated\ndevelopers only" },
      { value: "5.5 hrs", label: "AU/Indonesia\ntimezone overlap" },
      { value: "90%", label: "Developers\nwith strong English" },
      { value: "30 days", label: "Notice to scale team,\nno penalty" },
      { value: "<2%", label: "Developer churn rate" },
    ],
  },
  process: {
    eyebrow: "HOW WE WORK",
    heading: "Our Hiring Process",
    body: "From first call to a fully onboarded team, here's how a Upscalix engagement runs.",
    steps: [
      "Discovery Call",
      "Define Requirements",
      "Candidate Shortlisting",
      "Technical Interview",
      "Team Onboarding",
      "Ongoing Collaboration",
    ],
  },
  caseStudy: {
    heading: "Helping a Property Management Platform Scale With a Dedicated Offshore Team",
    challenge:
      "A property management platform needed to give building managers and residents a seamless way to interact digitally — and needed an engineering team that could work as a true extension of the business, not a rotating project vendor.",
    solution:
      "Upscalix provided a dedicated full-stack offshore development team who built and maintained the platform end-to-end, integrated directly into the client's own workflow.",
    impact:
      "The app reached strong, sustained resident engagement, powered entirely by the dedicated offshore team.",
    metric: {
      value: "90%",
      label:
        "Tenant engagement rate achieved on the platform, powered by Upscalix's full-stack offshore team",
    },
    thumbnail: "/landing/case-study-thumb.webp",
  },
  faq: [
    {
      question: "How quickly can developers start?",
      answer:
        "Most developers are onboarded within one to two weeks of the initial call, because we match against engineers who are already vetted and available.",
    },
    {
      question: "Can we interview developers?",
      answer:
        "Yes. You run a technical interview with every candidate and decide who joins your team.",
    },
    {
      question: "What timezone do developers work in?",
      answer:
        "Our developers work Australian business hours, giving roughly 5.5 hours of live overlap with AEST every working day.",
    },
    {
      question: "Can we replace developers if needed?",
      answer:
        "Yes. If someone isn't the right fit we replace them at no extra cost, and we handle the handover so your delivery keeps moving.",
    },
    {
      question: "How do you ensure code quality?",
      answer:
        "Code review on every pull request, automated unit and integration tests, CI/CD pipelines, and documentation standards enforced by a technical lead.",
    },
    {
      question: "How do you manage communication?",
      answer:
        "Your developers join your standups and work inside your tools — Slack, Teams, Jira, Linear — so you talk to the engineers directly.",
    },
  ],
  form: {
    heading: "Build Your Offshore Development Team",
    body: "Tell us about your project and we'll get back to you within one business day.",
    extraField: { name: "roles", label: "Roles Required", icon: "userGroup" },
    detailsLabel: "Project Details",
  },
};

const customSoftwareDevelopment: FigmaLandingPage = {
  layout: "figma",
  slug: "custom-software-development",
  meta: {
    title: "Custom Software Development Australia — Upscalix",
    description:
      "From idea to deployment, Upscalix builds scalable custom software for Australian businesses — internal systems, customer portals, web and mobile apps, and integrations.",
  },
  nav: [
    { label: "OUR WORK", href: "#case-study" },
    { label: "WHAT WE CAN BUILD", href: "#what-we-build" },
    { label: "HOW WE WORK", href: "#process" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: { label: "Discuss Your Project", href: BOOKING_URL },
  hero: {
    eyebrow: "CUSTOM SOFTWARE DEVELOPMENT",
    heading: "Custom Software Built Around Your Business",
    body: "From idea to deployment, Upscalix helps Australian businesses build scalable software solutions that improve efficiency, streamline operations, and support long-term growth.",
  },
  challenge: {
    eyebrow: "BUSINESS CHALLENGES",
    heading: "Off-the-Shelf Software Doesn't Always Fit Your Business",
    body: "As businesses grow, spreadsheets, disconnected systems, and manual workflows create inefficiencies that slow operations and limit scalability.",
    items: [
      "Manual processes",
      "Legacy systems",
      "Disconnected applications",
      "Limited scalability",
      "Repetitive administrative work",
      "Lack of system integration",
    ],
  },
  ctaBand: {
    heading: "Ready to Build the Right Solution?",
    body:
      "Let's discuss your business challenges and identify the right software solution for your organisation.",
  },
  offer: {
    id: "what-we-build",
    eyebrow: "WHAT WE CAN BUILD",
    heading: "Solutions We Deliver",
    body: "From internal tools to customer-facing platforms, we build the systems your business runs on — designed to fit your workflows, not the other way around.",
    grid: {
      kind: "tiles",
      columns: 3,
      items: [
        { icon: Icons.HugeiconsJobLinkIcon, title: "Internal Business Systems" },
        { icon: Icons.HugeiconsComputerUserIcon, title: "Customer Portals" },
        { icon: Icons.HugeiconsWebDesign01Icon, title: "Web Applications" },
        { icon: Icons.HugeiconsMobileProgramming01Icon, title: "Mobile Applications" },
        { icon: Icons.HugeiconsFlowIcon, title: "Workflow Automation" },
        { icon: Icons.HugeiconsApiGatewayIcon, title: "API & System Integrations" },
      ],
    },
  },
  stats: {
    eyebrow: "WHY UPSCALIX",
    heading: "Why Businesses Choose Upscalix",
    items: [
      { value: "70%", label: "Cost savings vs. local hires" },
      { value: "5+ yrs", label: "Average engineer experience" },
      { value: "30 days", label: "Notice to scale team, no penalty" },
      { value: "40+", label: "Australian businesses trusted" },
    ],
  },
  process: {
    eyebrow: "HOW WE WORK",
    heading: "Our Development Process",
    body:
      "A clear, collaborative path from first workshop to launch and beyond — so you always know what's being built, and why.",
    steps: [
      "Discovery & Analysis",
      "Solution & UX Design",
      "Software Development",
      "QA & Testing",
      "Deployment",
      "Ongoing Support",
    ],
  },
  caseStudy: {
    heading: "Turning an Idea Into a Secure Custom Platform for Straddles",
    challenge:
      "Straddles approached Upscalix with only an idea — a platform to build trust between buyers and sellers of secondhand vehicles — and needed a partner to turn that concept into a secure, working product from the ground up.",
    solution:
      "A seven-person Upscalix team — including a project manager, business analyst, QA, and developers — built a custom company website plus a secure transaction dashboard with real-time buyer/seller notifications and a full content management system.",
    impact:
      "Straddles launched with a fully functional, easily updatable platform handling secure transactions end-to-end, and has continued to expand its partnership with Upscalix on further work.",
    metric: {
      value: "5 mo.",
      label:
        "From concept to a fully functional platform, delivered by a 7-person Upscalix team",
    },
    thumbnail: "/landing/case-study-thumb-custom-software.webp",
    href: projectUrl("straddles"),
  },
  projects: {
    items: [PROJECTS.crcCare, PROJECTS.consultnoteAi, PROJECTS.jmax],
  },
  faq: [
    {
      question: "How long does a software project take?",
      answer:
        "Most builds run three to six months from discovery to launch. We scope the first release deliberately small so you get something working in production early, then iterate.",
    },
    {
      question: "How is pricing determined?",
      answer:
        "Either a fixed price against an agreed scope, or a monthly team rate if the roadmap is still moving. We quote after the discovery session, not before.",
    },
    {
      question: "Can you modernise an existing system?",
      answer:
        "Yes. We regularly take on legacy applications — auditing what's there, then replacing or re-platforming it incrementally so the business keeps running throughout.",
    },
    {
      question: "What technologies do you work with?",
      answer:
        "Primarily TypeScript, React, Next.js, Node, .NET, Python, React Native and Flutter, on AWS or Azure. We'll work in your existing stack where you already have one.",
    },
    {
      question: "Will you provide ongoing support?",
      answer:
        "Yes. Most clients continue on a support and enhancement retainer after launch, covering maintenance, updates, and new features.",
    },
    {
      question: "Can the software integrate with existing platforms?",
      answer:
        "Yes. Integrations with accounting, CRM, ERP, and payment systems are a standard part of what we build, via published APIs or custom connectors.",
    },
  ],
  form: {
    heading: "Let's Build Your Software Solution",
    body:
      "Tell us about your project and our team will recommend the most suitable approach for your business.",
    detailsLabel: "Project Overview",
  },
};

/**
 * Figma "Landing Page 1" (node 89:92), built the way the frame actually draws
 * it. The body copy is the same as /it-outsourcing — that page renders this
 * same frame in the older house layout — but here the enquiry form sits in the
 * hero, the case study runs ahead of the CTA band, and there is no solution
 * grid, because the frame has none. Only the metadata is deliberately
 * different, so the two URLs don't compete for the same query.
 */
const dedicatedDevelopmentTeams: FigmaLandingPage = {
  layout: "figma",
  slug: "dedicated-development-teams",
  meta: {
    title: "Dedicated Development Teams Australia | Hire Engineers — Upscalix",
    description:
      "Build a dedicated software development team that works as part of your business. Upscalix helps Australian companies scale engineering without local hiring delays.",
  },
  /**
   * The frame has no in-page nav — just the logo and the booking button — so
   * there is nothing to link. An ads page has one job, and section links are an
   * invitation to wander off it.
   */
  nav: [],
  cta: { label: "Book Free Consultation", href: BOOKING_URL },
  hero: {
    eyebrow: "DEDICATED DEVELOPMENT TEAMS",
    heading: "Build Your Dedicated Development Team Without Local Hiring Delays",
    body: "Upscalix helps Australian businesses build dedicated software development teams that integrate seamlessly with your company, allowing you to scale faster while reducing hiring complexity.",
  },
  challenge: {
    eyebrow: "THE CHALLENGE",
    heading: "Hiring Software Developers Shouldn't Slow Your Business Down",
    body: "Finding experienced software developers locally has become increasingly difficult. Long recruitment cycles, rising hiring costs, and limited talent availability often delay projects and slow business growth.",
    items: [
      "Long recruitment process",
      "Rising hiring costs",
      "Limited local talent",
      "Difficult to scale engineering teams",
      "Delayed project delivery",
    ],
  },
  ctaBand: {
    heading: "Need to Scale Your Development Team?",
    body: "Book a free consultation and discover how Upscalix can help you build a dedicated development team.",
  },
  offer: {
    id: "engagement-models",
    eyebrow: "ENGAGEMENT MODELS",
    heading: "Choose the Engagement Model that Fits Your Business",
    body: "Whether you need one developer or an entire software engineering team, Upscalix offers flexible engagement models tailored to your business objectives.",
    grid: {
      kind: "models",
      items: [
        {
          eyebrow: "MODEL 01",
          title: "Dedicated Team",
          body: "A full team — developers, QA, and a project lead — working exclusively on your product, integrated into your existing workflow.",
          bestFit: "ongoing product development",
        },
        {
          eyebrow: "MODEL 02",
          title: "Team Extension",
          body: "Add individual developers directly into your in-house team to cover a skills gap or free up your senior engineers.",
          bestFit: "scaling an existing team fast",
        },
        {
          eyebrow: "MODEL 03",
          title: "Project-Based Development",
          body: "A fixed-scope team delivers a defined project from spec to launch, with a dedicated project manager.",
          bestFit: "a scoped build with a fixed timeline",
        },
      ],
    },
  },
  stats: {
    eyebrow: "WHY UPSCALIX",
    heading: "Why Australian Businesses Choose Upscalix",
    items: [
      { value: "70%", label: "Cost savings\nvs. local hires" },
      { value: "<2%", label: "Developer churn rate" },
      { value: "5+ yrs", label: "Average developer experience" },
      { value: "90%", label: "Developers\nwith strong English" },
      { value: "40+", label: "Australian\nbusinesses trusted" },
    ],
  },
  process: {
    eyebrow: "HOW WE WORK",
    heading: "Our Engagement Process",
    body: "From first call to a fully onboarded team, here's the path every engagement follows.",
    steps: [
      "Discovery Call",
      "Requirement Analysis",
      "Talent Matching",
      "Interview & Selection",
      "Team Onboarding",
      "Continuous Delivery & Scaling",
    ],
  },
  caseStudy: {
    heading: "Helping an Australian Residential App Provider Scale Its Engineering Team",
    challenge:
      "Needed to scale engineering fast to keep pace with property-manager demand, without the cost or delay of local hiring.",
    solution:
      "Upscalix embedded a dedicated full-stack team directly into the client's existing workflow within weeks.",
    impact:
      "Faster release cycles and a platform built to support ongoing growth in resident engagement.",
    metric: {
      value: "90%",
      label:
        "Tenant engagement rate achieved on the platform, powered by Upscalix's full-stack offshore team",
    },
    thumbnail: "/landing/case-study-thumb.webp",
    // No `href`: this story has no write-up on upscalix.com.au/project, and the
    // button is dropped rather than pointed somewhere unrelated.
  },
  projects: {
    items: [PROJECTS.crcCare, PROJECTS.timeDriver, PROJECTS.jmax],
  },
  faq: [
    {
      question: "How quickly can we start?",
      answer:
        "Most engagements kick off within one to two weeks. We match your requirements against pre-vetted senior engineers, so there is no lengthy recruitment cycle to wait through.",
    },
    {
      question: "Can we interview developers?",
      answer:
        "Yes. You interview every developer before they join your team, and you make the final call on who comes on board.",
    },
    {
      question: "Can we scale the team later?",
      answer:
        "Yes — you can add or reduce developers as your roadmap changes, without renegotiating a new contract.",
    },
    {
      question: "How do you manage communication?",
      answer:
        "Your developers work in your tools — Slack, Teams, Jira, Linear — and join your standups directly. There is no account manager sitting between you and the engineers.",
    },
    {
      question: "What engagement models are available?",
      answer:
        "Three: a dedicated team working exclusively on your product, team extension where individual developers join your in-house team, and project-based delivery for a fixed scope and timeline.",
    },
    {
      question: "How is pricing structured?",
      answer:
        "A simple monthly rate per developer that covers salary, HR, payroll, equipment, and management. No recruitment fees and no hidden charges.",
    },
  ],
  form: {
    heading: "Let's Build Your Development Team",
    body: "Tell us about your project and we'll get back to you within one business day.",
    detailsLabel: "Project Details",
  },
};

/**
 * Figma "Landing Page 4" (node 95:1098). This frame has no challenge list and
 * no solution grid — it leads with the offer grid straight after the client
 * logos, and adds the tech-logo wall and the roles row below the CTA band.
 *
 * The frame draws the FAQ accordions collapsed, so the six answers below are
 * written here rather than lifted from the design, matching the voice and the
 * claims already made on the other pages.
 */
const mobileAppDevelopment: FigmaLandingPage = {
  layout: "figma",
  slug: "mobile-app-development",
  meta: {
    title: "Mobile App Development Australia | Offshore App Developers — Upscalix",
    description:
      "Hire offshore mobile app developers for native iOS, Android, cross-platform and progressive web apps. Australian-managed teams working in your timezone.",
  },
  /**
   * The frame has no in-page nav — just the logo and the booking button — so
   * there is nothing to link. An ads page has one job, and section links are an
   * invitation to wander off it.
   */
  nav: [],
  cta: { label: "Discuss Your Project", href: BOOKING_URL },
  hero: {
    eyebrow: "MOBILE APP DEVELOPMENT",
    heading: "Upscale Your Business with Offshore App Developers",
    body: "Upscalix provides additional mobile app developers to help you build various types of mobile apps such as native, cross-platform, or progressive web app (PWA)",
  },
  ctaBand: {
    heading: "Ready to Build the Right Solution?",
    body: "Let's discuss your business challenges and identify the right software solution for your organisation.",
  },
  offer: {
    id: "what-we-build",
    eyebrow: "WHAT WE CAN BUILD",
    heading: "Mobile Apps Development Options",
    body: "Reach your customer with an app tailored to their needs",
    grid: {
      kind: "tiles",
      columns: 3,
      items: [
        { icon: Icons.HugeiconsAppleIcon, title: "iOS\nMobile App Developers" },
        { icon: Icons.HugeiconsAndroidIcon, title: "Android\nMobile App Developers" },
        {
          icon: Icons.HugeiconsMobileProgramming01Icon,
          title: "Cross-platform\nMobile App Developers",
        },
      ],
    },
  },
  expertise: {
    heading: "Our Mobile App Developers Expertise",
    note: "and many other skills. Just ask us!",
    logos: [
      { src: "/landing/tech/react.svg", alt: "React", width: 60, height: 52 },
      { src: "/landing/tech/swift.png", alt: "Swift", width: 225, height: 225 },
      { src: "/landing/tech/cpp.png", alt: "C++", width: 1200, height: 1351 },
      { src: "/landing/tech/flutter.png", alt: "Flutter", width: 200, height: 200 },
      { src: "/landing/tech/rails.png", alt: "Ruby on Rails", width: 1000, height: 420 },
      { src: "/landing/tech/mongodb.png", alt: "MongoDB", width: 140, height: 38 },
      { src: "/landing/tech/kotlin.png", alt: "Kotlin", width: 384, height: 131 },
      { src: "/landing/tech/java.png", alt: "Java", width: 301, height: 168 },
      { src: "/landing/tech/mysql.png", alt: "MySQL", width: 124, height: 64 },
      { src: "/landing/tech/postgresql.png", alt: "PostgreSQL", width: 64, height: 64 },
    ],
  },
  roles: {
    heading: "Roles We Support",
    items: [
      "Native Developers",
      "Cross Platform Developers",
      "Database Engineers",
      "Full Stack Developers",
      "System Architects",
    ],
  },
  stats: {
    eyebrow: "WHY UPSCALIX",
    heading: "Why Businesses Choose Upscalix",
    items: [
      { value: "70%", label: "Cost savings vs. local hires" },
      { value: "5+ yrs", label: "Average engineer experience" },
      { value: "30 days", label: "Notice to scale team, no penalty" },
      { value: "40+", label: "Australian businesses trusted" },
    ],
  },
  process: {
    eyebrow: "HOW WE WORK",
    heading: "Our Development Process",
    body:
      "A clear, collaborative path from first workshop to launch and beyond — so you always know what's being built, and why.",
    steps: [
      "Discovery & Analysis",
      "Solution & UX Design",
      "Software Development",
      "QA & Testing",
      "Deployment",
      "Ongoing Support",
    ],
  },
  projects: {
    eyebrow: "OUR CAPABILITIES",
    heading: "Tailored Mobile Solutions for Every Industry",
    body: "From gig platforms to community marketplaces, we engineer tailored mobile experiences that drive real engagement.",
    items: [PROJECTS.timeDriver, PROJECTS.frootMap, PROJECTS.popScongs],
  },
  faq: [
    {
      question: "Why should I hire an offshore mobile app developer?",
      answer:
        "You get senior mobile engineers at around 70% less than the equivalent local hire, and you can start in one to two weeks instead of waiting out a local recruitment cycle. The developers work only on your product, so the same people stay with the app as it evolves.",
    },
    {
      question: "How do you ensure the quality of offshore mobile app developers?",
      answer:
        "Every developer is technically vetted before you meet them, and you run your own interview before anyone joins. Day to day, quality is held by code review on every pull request, automated tests, CI/CD pipelines, and a technical lead accountable for the codebase.",
    },
    {
      question: "Will communication be a challenge with an offshore development team?",
      answer:
        "Our developers work Australian business hours — roughly 5.5 hours of live overlap with AEST every working day — and join your standups inside your own tools, whether that is Slack, Teams, Jira or Linear. You talk to the engineers directly, not through an account manager.",
    },
    {
      question: "Can offshore developers build apps for both iOS and Android?",
      answer:
        "Yes. We staff native iOS (Swift) and native Android (Kotlin) developers, as well as cross-platform teams working in Flutter or React Native when a single codebase is the better fit for your budget and roadmap.",
    },
    {
      question: "What if I need updates or maintenance after the app is launched?",
      answer:
        "Most clients keep the same team on a support and enhancement retainer after launch, covering OS updates, app store releases, bug fixes and new features. You can scale that up or down as your roadmap changes.",
    },
  ],
  form: {
    heading: "Let's Build Your Software Solution",
    body: "Tell us about your project and our team will recommend the most suitable approach for your business.",
    detailsLabel: "Project Overview",
  },
};

export const LANDING_PAGES = {
  "it-outsourcing": itOutsourcing,
  "offshore-developers": offshoreDevelopers,
  "custom-software-development": customSoftwareDevelopment,
  "dedicated-development-teams": dedicatedDevelopmentTeams,
  "mobile-app-development": mobileAppDevelopment,
} satisfies Record<string, LandingPageContent>;

export type LandingSlug = keyof typeof LANDING_PAGES;
