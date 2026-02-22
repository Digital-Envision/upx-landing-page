import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const includedFeatures = [
  "Dedicated senior fullstack team",
  "Technical Lead / Project Manager",
  "QA Engineer included",
  "Daily standups & weekly demos",
  "Agile/Scrum methodology",
  "Direct Slack/Teams communication",
  "4-hour timezone overlap (AEST)",
  "Code reviews & documentation",
  "CI/CD pipeline setup",
  "Monthly performance reports",
];

const teamComposition = [
  { role: "Technical Lead / PM", count: 1, color: "bg-primary" },
  { role: "Senior Fullstack Engineers", count: 3, color: "bg-accent" },
  { role: "QA Engineer", count: 1, color: "bg-primary-light" },
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-[#FAFAFA] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-16 text-center">
            <Badge variant="accent" className="mb-4">
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-[#333] sm:text-4xl md:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              One team, one price. No hidden fees, no surprises — just a
              world-class engineering team ready to ship.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Pricing card */}
        <AnimateOnScroll>
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
              <div className="flex flex-col lg:flex-row">
                {/* Left: Price + Team */}
                <div className="flex flex-col justify-center bg-gradient-to-br from-primary to-primary-dark p-8 text-white lg:w-2/5 lg:p-12">
                  <p className="text-sm font-medium uppercase tracking-wider text-white/70">
                    Starting from
                  </p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-5xl font-bold lg:text-6xl">
                      $4,000
                    </span>
                    <span className="text-lg text-white/70">/dev/month</span>
                  </div>
                  <p className="mt-4 text-sm text-white/80">
                    Full-time dedicated team. No lock-in contracts. Scale up or
                    down anytime.
                  </p>

                  {/* Team composition */}
                  <div className="mt-8">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">
                      Your team includes
                    </p>
                    <div className="space-y-3">
                      {teamComposition.map((member) => (
                        <div
                          key={member.role}
                          className="flex items-center gap-3"
                        >
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${member.color} text-white`}
                          >
                            {member.count}
                          </div>
                          <span className="text-sm text-white/90">
                            {member.role}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-lg bg-white/10 px-4 py-3">
                      <p className="text-sm font-medium text-white">
                        5 team members total
                      </p>
                      <p className="text-xs text-white/70">
                        A complete squad ready to deliver
                      </p>
                    </div>
                  </div>

                  <Button
                    as="a"
                    href="https://calendar.google.com"
                    variant="secondary"
                    size="lg"
                    className="mt-8 w-full justify-center"
                  >
                    Book Discovery Call
                  </Button>
                </div>

                {/* Right: Features */}
                <div className="flex-1 p-8 lg:p-12">
                  <h3 className="text-lg font-bold text-[#333]">
                    Everything included
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    No add-ons, no upsells. Every feature comes standard.
                  </p>

                  <ul className="mt-8 space-y-4">
                    {includedFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-[#333]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 rounded-xl bg-[#EEFFF8] p-4">
                    <p className="text-sm font-medium text-[#333]">
                      Save up to 60% compared to local hiring
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      No superannuation, benefits, or overhead costs. Just
                      transparent team pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
