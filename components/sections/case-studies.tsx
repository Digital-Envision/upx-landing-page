import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const caseStudies = [
  {
    company: "FinTrack",
    industry: "Fintech",
    headline: "From MVP to 50k users in 6 months",
    description:
      "We built a complete financial tracking platform from scratch — backend APIs, real-time dashboards, and mobile-responsive UI — helping FinTrack launch to market 3x faster than their original timeline.",
    metrics: [
      { label: "Launch time", value: "6 months" },
      { label: "Active users", value: "50,000+" },
      { label: "Uptime", value: "99.9%" },
    ],
    color: "bg-primary",
    cardBg: "bg-[#FFF8F0]",
    accentGradient: "from-[#FFF0E0] to-[#FFF8F0]",
  },
  {
    company: "EduPlatform",
    industry: "EdTech",
    headline: "Scaling an LMS to 200+ schools",
    description:
      "Our team rebuilt the legacy monolith into a scalable microservices architecture, added real-time collaboration features, and improved page load times by 70% — enabling nationwide school adoption.",
    metrics: [
      { label: "Schools onboarded", value: "200+" },
      { label: "Performance gain", value: "70%" },
      { label: "API response", value: "<100ms" },
    ],
    color: "bg-accent",
    cardBg: "bg-[#FEF2F8]",
    accentGradient: "from-[#FDE8F0] to-[#FEF2F8]",
  },
  {
    company: "ShopLocal",
    industry: "Marketplace",
    headline: "A marketplace processing $2M+ monthly",
    description:
      "We designed and built a multi-vendor marketplace with payment processing, inventory management, and a recommendation engine — handling thousands of transactions daily with zero downtime.",
    metrics: [
      { label: "Monthly GMV", value: "$2M+" },
      { label: "Vendors", value: "500+" },
      { label: "Downtime", value: "0" },
    ],
    color: "bg-primary-light",
    cardBg: "bg-[#F0F4FF]",
    accentGradient: "from-[#E8EEFF] to-[#F0F4FF]",
  },
];

export function CaseStudiesSection() {
  return (
    <section id="case-studies" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-16 text-center">
            <Badge variant="accent" className="mb-4">
              Case Studies
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-[#333] sm:text-4xl md:text-5xl">
              Real results from real projects
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              See how our teams have helped companies build, scale, and ship
              world-class products.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Case study cards */}
        <div className="space-y-8">
          {caseStudies.map((study) => (
            <AnimateOnScroll key={study.company}>
              <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="flex flex-col lg:flex-row">
                  {/* Monitor mockup illustration */}
                  <div
                    className={`flex items-center justify-center bg-gradient-to-br ${study.accentGradient} p-8 lg:w-2/5`}
                  >
                    <Image
                      src="/illustrations/case-study-monitor.png"
                      alt={`${study.company} application dashboard`}
                      width={800}
                      height={800}
                      className="w-full max-w-sm drop-shadow-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
                    <div className="mb-2 flex items-center gap-3">
                      <span
                        className={`inline-block h-3 w-3 rounded-full ${study.color}`}
                      />
                      <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        {study.industry}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#333] lg:text-3xl">
                      {study.headline}
                    </h3>
                    <p className="mt-4 text-gray-500 leading-relaxed">
                      {study.description}
                    </p>

                    {/* Metrics */}
                    <div className="mt-8 flex gap-8">
                      {study.metrics.map((metric) => (
                        <div key={metric.label}>
                          <p className="text-2xl font-bold text-primary">
                            {metric.value}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
