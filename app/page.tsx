import Link from "next/link";
import { Logo } from "@/components/logo";
import { HeroSection } from "@/components/sections/hero";
import { PainPointsSection } from "@/components/sections/pain-points";
import { UniqueOpportunitySection } from "@/components/sections/unique-opportunity";
import { CountryMapSection } from "@/components/sections/country-map";
import { TeamSection } from "@/components/sections/team";
import { BenefitsSection } from "@/components/sections/benefits";
import { TechStackSection } from "@/components/sections/tech-stack";
import { CaseStudiesSection } from "@/components/sections/case-studies";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { DeRiskSection } from "@/components/sections/de-risk";
import { GuaranteeSection } from "@/components/sections/guarantee";
import { PricingSection } from "@/components/sections/pricing";
import { TeamScalesSection } from "@/components/sections/team-scales";
import { FAQSection } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta";
import { FloatingCTA } from "@/components/FloatingCTA";

export default function Home() {
  return (
    <>
      {/* Logo — top left, not sticky, matches hero bg */}
      <div className="bg-[#f8faff]">
        <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
          <Link href="/">
            <Logo width={130} height={34} />
          </Link>
        </div>
      </div>
      <main>
        {/* 1. Hero */}
        <HeroSection />
        {/* 2. Problem Agitation */}
        <PainPointsSection />
        {/* 3. Unique Mechanism */}
        <UniqueOpportunitySection />
        {/* 4. Team location & proof */}
        <CountryMapSection />
        {/* 5. Individual engineers */}
        <TeamSection />
        {/* 6. Value Stack (core offer + delivery + bonuses) */}
        <BenefitsSection />
        {/* 7. Tech breadth */}
        <TechStackSection />
        {/* 8. Proof: case studies */}
        <CaseStudiesSection />
        {/* 9. Proof: testimonials */}
        <TestimonialsSection />
{/* 10. De-risk */}
        <DeRiskSection />
        {/* 11. Guarantee */}
        <GuaranteeSection />
        {/* 12. Pricing */}
        <PricingSection />
        {/* 13. How it works */}
        <TeamScalesSection />
        {/* 14. FAQ */}
        <FAQSection />
        {/* 15. Final CTA */}
        <CTASection />
      </main>
      <FloatingCTA />
    </>
  );
}
