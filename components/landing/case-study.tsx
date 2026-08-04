import type { LandingPageContent } from "@/lib/landing/content";
import { Eyebrow, LpContainer } from "./ui";
import { VideoThumbnail } from "./video-thumbnail";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
      <dt className="w-[96px] shrink-0 pt-0.5 text-[12px] font-bold leading-[18px] text-lp-cyan">
        {label}
      </dt>
      <dd className="flex-1 text-[15px] font-medium leading-[22.5px] text-lp-navy-body">
        {children}
      </dd>
    </div>
  );
}

export function CaseStudySection({ content }: { content: LandingPageContent["caseStudy"] }) {
  return (
    <section id="case-study" className="bg-white pb-14 pt-16 md:pb-[56px] md:pt-[80px]">
      <LpContainer>
        <div className="rounded-[18px] bg-lp-navy p-6 sm:p-10 lg:p-12">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-12">
            <div className="flex-1">
              <Eyebrow tone="white" className="mb-4">
                FEATURED CASE STUDY
              </Eyebrow>
              <h2 className="text-[clamp(1.625rem,4.2vw,2.5rem)] font-bold leading-[1.2] text-balance text-white">
                {content.heading}
              </h2>
              <dl className="mt-8 flex flex-col gap-6">
                <Row label="CHALLENGE">{content.challenge}</Row>
                <Row label="SOLUTION">{content.solution}</Row>
                <Row label="IMPACT">{content.impact}</Row>
              </dl>
            </div>

            <div className="w-full shrink-0 lg:w-[476px]">
              <VideoThumbnail poster={content.thumbnail} />
              <div className="mt-4 flex items-center justify-center gap-6 rounded-[10px] bg-lp-cyan/10 p-6">
                <p className="whitespace-nowrap text-[40px] font-semibold leading-none text-lp-cyan sm:text-[56px]">
                  {content.metric.value}
                </p>
                <p className="max-w-[266px] text-[14px] font-medium leading-[21px] text-white">
                  {content.metric.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </LpContainer>
    </section>
  );
}
