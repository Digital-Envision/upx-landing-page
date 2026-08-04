import type { Faq } from "@/lib/landing/content";
import { LpContainer, SectionHeading } from "./ui";

/**
 * Native <details> disclosure — the design's plus/cross toggle, with no
 * JavaScript shipped for it. The first item is open, mirroring the Figma frame.
 */
export function FaqSection({ items }: { items: Faq[] }) {
  return (
    <section id="faq" className="bg-white pb-16 pt-14 md:pb-[80px] md:pt-[56px]">
      <LpContainer>
        <SectionHeading
          eyebrow="FAQ"
          heading="Questions, Answered"
          align="center"
          className="mx-auto max-w-[660px]"
        />
        <div className="mx-auto mt-[46px] max-w-[716px]">
          {items.map((faq, i) => (
            <details
              key={faq.question}
              open={i === 0}
              className="group border-b border-lp-line"
              name="landing-faq"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-[22px] [&::-webkit-details-marker]:hidden">
                <h3 className="text-[17px] font-semibold text-lp-navy sm:text-[20px]">
                  {faq.question}
                </h3>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-[22px] leading-none text-lp-blue transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[660px] pb-[22px] text-[16px] font-medium leading-[24px] text-lp-slate">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </LpContainer>
    </section>
  );
}
