import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const pricingRows = [
  { resource: "3 x senior developers", cost: "$12,000", isBold: true },
  { resource: "1 x technical lead / PM", cost: "Included", isBold: true },
  { resource: "1 x quality assurance", cost: "Included", isBold: true },
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl md:text-6xl">
              Simple, affordable pricing
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#555]">
              We charge $4,000 USD/mo per developer and we include a CTO level
              technical lead/PM and QA resource at no extra cost — minimum of 3
              developers
            </p>
          </div>
        </AnimateOnScroll>

        {/* Pricing table — clean like TurboTeam */}
        <AnimateOnScroll>
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
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
            <div className="flex items-center justify-between border-t border-gray-200 px-8 py-5">
              <span className="text-base font-medium text-[#3B82F6]">Total</span>
              <span className="text-base font-bold text-[#3B82F6]">$12,000</span>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Savings note */}
        <AnimateOnScroll>
          <p className="mt-6 text-center text-sm text-[#555]">
            Save up to 60% compared to local hiring. No superannuation,
            benefits, or overhead costs.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
