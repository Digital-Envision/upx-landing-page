import type { LandingPageContent } from "@/lib/landing/content";
import { FORM_ASSURANCES } from "@/lib/landing/content";
import { Eyebrow, LpContainer } from "./ui";
import { ContactForm } from "./contact-form";

export function ContactSection({ content }: { content: LandingPageContent }) {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#214a90] py-16 md:py-[72px]">
      {/* The Upscalix mark blown up as a background flourish, turned 45deg and
          bleeding off the right edge. The square wrapper is the mark's rotated
          bounding box: 111.53% of the section width, nudged up by 3.52% of its
          own size. Its left offset is fitted against the Figma render rather
          than taken from the node's reported x — for a rotated node that x is
          the pre-rotation origin, which sits well right of where the rotated
          artwork actually starts. Decorative, so it is hidden from assistive
          tech and dropped on small screens where there is no room for it. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[35.95%] top-0 hidden aspect-square w-[111.53%] -translate-y-[3.52%] items-center justify-center lg:flex"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- a decorative
            1KB vector; next/image would only add an optimizer round-trip. */}
        <img
          src="/landing/contact-decoration.svg"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-[68.6%] w-[72.9%] max-w-none rotate-45"
        />
      </span>

      <LpContainer className="relative grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow tone="white" className="mb-4">
            GET STARTED
          </Eyebrow>
          <h2 className="max-w-[486px] text-[clamp(1.75rem,4.2vw,2.5rem)] font-bold leading-[1.2] text-balance text-white">
            {content.form.heading}
          </h2>
          <p className="mt-3.5 max-w-[486px] text-[17px] font-medium leading-[30px] text-white sm:text-[18px]">
            {content.form.body}
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {FORM_ASSURANCES.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 text-lp-cyan"
                >
                  <path
                    d="m4 12.5 5 5L20 6.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[16px] font-medium leading-6 text-white">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <ContactForm content={content.form} slug={content.slug} ctaLabel={content.cta.label} />
      </LpContainer>
    </section>
  );
}
