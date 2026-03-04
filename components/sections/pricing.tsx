import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const pricingRows = [
  { resource: "3 x Senior Developers", cost: "AU$18,000", isBold: true },
  { resource: "1 x Technical Lead / PM", cost: "Included", isBold: true },
  { resource: "1 x QA Engineer", cost: "Included", isBold: true },
];

const useCases = [
  {
    title: "Pod Expansion",
    subtitle: "1–3 engineers",
    description: "Add capacity to an existing squad fast — same tech standards, zero onboarding drag.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  {
    title: "Feature Squad",
    subtitle: "Bounded scope, full ownership",
    description: "Spin up a pod to own a feature end-to-end — product, engineering, and QA in one team.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Stabilisation Sprint",
    subtitle: "Tech debt + reliability",
    description: "Improve release cadence, tame tech debt, and reduce incident rate — with a senior team built for it.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-[#FAFBFF] py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl">
              Simple pricing that scales with your roadmap
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#555]">
              AU$6,000/mo per developer — with a CTO-level Tech Lead/PM and QA included at no extra cost. Minimum 3 developers.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Pricing table */}
        <AnimateOnScroll>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#FAFAFA] px-8 py-4">
              <span className="text-sm font-medium text-[#666]">Resource</span>
              <span className="text-sm font-medium text-[#666]">Monthly Cost</span>
            </div>

            {/* Data rows */}
            {pricingRows.map((row) => (
              <div
                key={row.resource}
                className="flex items-center justify-between border-b border-gray-200 px-8 py-5 last:border-b-0"
              >
                <span className="text-base text-[#1a1a1a]">{row.resource}</span>
                <span className="text-base font-bold text-[#1a1a1a]">
                  {row.cost}
                </span>
              </div>
            ))}

            {/* Total row */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-[#f0f4ff] px-8 py-5">
              <span className="text-base font-semibold text-[#2248F3]">Total</span>
              <span className="text-base font-bold text-[#2248F3]">AU$18,000 / month</span>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Savings note */}
        <AnimateOnScroll>
          <p className="mt-5 text-center text-sm text-[#555]">
            Save up to 60% compared to local hiring. No superannuation, benefits, or overhead costs.
          </p>
        </AnimateOnScroll>

        {/* Use case cards */}
        <AnimateOnScroll>
          <div className="mt-16">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-[#2248F3]">Common Use Cases</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {useCases.map((uc) => (
                <div
                  key={uc.title}
                  className="animated-border-card p-7"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f4ff] text-[#2248F3]">
                    {uc.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#1a1a1a]">{uc.title}</h3>
                  <p className="mt-0.5 text-xs font-medium text-[#2248F3]">{uc.subtitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#555]">{uc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
