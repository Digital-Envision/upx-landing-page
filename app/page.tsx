import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { PainPointsSection } from "@/components/sections/pain-points";
import { CountryMapSection } from "@/components/sections/country-map";
import { TeamSection } from "@/components/sections/team";
import { BenefitsSection } from "@/components/sections/benefits";
import { TechStackSection } from "@/components/sections/tech-stack";
import { CaseStudiesSection } from "@/components/sections/case-studies";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { PartnerRecommendationsSection } from "@/components/sections/partner-recommendations";
import { TeamScalesSection } from "@/components/sections/team-scales";
import { PricingSection } from "@/components/sections/pricing";
import { FAQSection } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PainPointsSection />
        <CountryMapSection />
        <TeamSection />
        <BenefitsSection />
        <TechStackSection />
        <CaseStudiesSection />
        <TestimonialsSection />
        <PartnerRecommendationsSection />
        <TeamScalesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
