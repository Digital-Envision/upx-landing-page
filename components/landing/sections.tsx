import Image from "next/image";
import { clsx } from "clsx";
import type { LandingPageContent, ModelCard, TileCard } from "@/lib/landing/content";
import { TRUSTED_BY } from "@/lib/landing/content";
import { CtaButton, IconMedallion, LpContainer, SectionHeading } from "./ui";

/* ------------------------------------------------------------------ logos */

const LOGO_STRIP_ALT =
  "Monash University, CRC Care, JMAX, McDonald's, Pass Point, Flair & Fine Care, Stockdale & Leggo, Dagli, Novachem and other Australian clients";

export function ClientLogos() {
  return (
    <section className="bg-white py-10 md:py-[40px]">
      <LpContainer>
        <p className="text-center text-[14px] font-medium tracking-[2px] text-lp-slate">
          {TRUSTED_BY}
        </p>
      </LpContainer>

      {/* Full-bleed marquee: the roster runs edge to edge and drifts slowly
          right-to-left. Two identical copies share one track and the keyframe
          translates exactly -50%, so the loop is seamless. */}
      <div className="mt-[40px] w-full overflow-hidden">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <Image
              key={copy}
              src="/landing/client-logos-strip.webp"
              alt={copy === 0 ? LOGO_STRIP_ALT : ""}
              aria-hidden={copy === 1}
              width={4320}
              height={120}
              // Served as-is. Re-encoding a 4320x120 strip to AVIF is slow
              // enough to monopolise the image optimizer on a cold cache and
              // starve the other images on the page; the source is already a
              // 38KB WebP sized for the render width. Both copies resolve to
              // the same URL, so this is still one request.
              unoptimized
              loading="eager"
              // The strip's artwork runs flush to both edges, so each copy
              // carries its own trailing gap — otherwise the last logo butts
              // straight into the first at the loop seam. 57px reproduces the
              // strip's own 171px inter-logo spacing at this 1440px render
              // (the source is 4320px wide), so the seam is indistinguishable
              // from every other gap. Keeping it *inside* the copy means the
              // track stays exactly two equal units wide, so the -50% keyframe
              // remains seamless.
              className="mr-[57px] h-10 w-[1440px] max-w-none object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- challenge */

export function ChallengeSection({ content }: { content: LandingPageContent["challenge"] }) {
  return (
    <section className="bg-lp-mist py-16 md:py-[80px]">
      <LpContainer className="grid items-center gap-12 lg:grid-cols-2 lg:gap-12">
        <SectionHeading
          eyebrow={content.eyebrow}
          heading={content.heading}
          body={content.body}
          className="max-w-[660px]"
        />
        <ul className="overflow-hidden rounded-lg border border-lp-line bg-white">
          {content.items.map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-6 border-b border-lp-line px-6 py-5 last:border-b-0"
            >
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-lp-blue text-[12px] font-bold leading-4 text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[16px] font-semibold text-lp-navy sm:text-[18px]">{item}</span>
            </li>
          ))}
        </ul>
      </LpContainer>
    </section>
  );
}

/* ---------------------------------------------------------------- cta band */

export function CtaBand({
  content,
  cta,
}: {
  content: LandingPageContent["ctaBand"];
  cta: LandingPageContent["cta"];
}) {
  return (
    <section className="bg-lp-navy py-14 md:py-[64px]">
      <LpContainer className="flex flex-col items-center text-center">
        <h2 className="text-[clamp(1.625rem,4.2vw,2.5rem)] font-bold leading-[1.2] text-balance text-white">
          {content.heading}
        </h2>
        <p className="mt-3 max-w-[492px] text-[17px] font-medium leading-[27px] text-lp-navy-muted sm:text-[18px]">
          {content.body}
        </p>
        <CtaButton href={cta.href} className="mt-4">
          {cta.label}
        </CtaButton>
      </LpContainer>
    </section>
  );
}

/* --------------------------------------------------------------- solution */

export function SolutionSection({ content }: { content: LandingPageContent["solution"] }) {
  return (
    <section id="solution" className="bg-lp-mist pb-14 pt-16 md:pb-[56px] md:pt-[80px]">
      <LpContainer>
        <SectionHeading
          eyebrow={content.eyebrow}
          heading={content.heading}
          body={content.body}
          className="max-w-[720px]"
        />
        <div className="mt-[46px] grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.cards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col rounded-lg bg-white px-6 py-[30px]"
            >
              <IconMedallion icon={card.icon} />
              <h3 className="pt-6 text-[20px] font-bold leading-[24.8px] text-lp-navy">
                {card.title}
              </h3>
              <p className="pt-2 text-[16px] font-medium leading-[26px] text-lp-slate">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </LpContainer>
    </section>
  );
}

/* ------------------------------------------------------------- offer grid */

function ModelCards({ items }: { items: ModelCard[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {items.map((model, i) => {
        // The middle card is inverted in the design to mark the popular option.
        const featured = i === 1;
        return (
          <article
            key={model.title}
            className={clsx(
              "flex flex-col rounded-lg border px-[27px] py-[31px]",
              featured ? "border-lp-navy bg-lp-navy" : "border-lp-line bg-white"
            )}
          >
            <span
              className={clsx(
                "mb-4 self-start rounded-full px-3 py-1.5 text-[12px] font-bold leading-[18px]",
                // See Eyebrow: the deeper blue keeps 12px text above AA on the
                // pale chip background.
                featured ? "bg-lp-cyan/[0.18] text-lp-cyan" : "bg-lp-chip text-lp-blue-deep"
              )}
            >
              {model.eyebrow}
            </span>
            <h3
              className={clsx(
                "pb-2.5 text-[25px] font-bold leading-[31px]",
                featured ? "text-white" : "text-lp-navy"
              )}
            >
              {model.title}
            </h3>
            <p
              className={clsx(
                "flex-1 pb-5 text-[16px] font-medium leading-[26px]",
                featured ? "text-white" : "text-lp-slate"
              )}
            >
              {model.body}
            </p>
            <p
              className={clsx(
                "border-t pt-[15px] text-[14px] font-medium leading-[21px]",
                featured ? "border-white/[0.16] text-white" : "border-lp-line text-lp-slate"
              )}
            >
              <strong className="font-bold">Best fit:</strong> {model.bestFit}
            </p>
          </article>
        );
      })}
    </div>
  );
}

function TileCards({ items, columns }: { items: TileCard[]; columns: 3 | 4 }) {
  return (
    <div
      className={clsx(
        "grid gap-6 sm:grid-cols-2",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
      )}
    >
      {items.map((tile) => (
        <article
          key={tile.title}
          className="flex flex-col items-center rounded-lg bg-white px-6 py-[30px] text-center"
        >
          <IconMedallion icon={tile.icon} />
          <h3 className="pt-6 text-[20px] font-bold leading-[24.8px] text-lp-navy">
            {tile.title}
          </h3>
        </article>
      ))}
    </div>
  );
}

export function OfferSection({
  content,
  id,
}: {
  content: LandingPageContent["offer"];
  id: string;
}) {
  return (
    <section id={id} className="bg-lp-mist pb-16 pt-14 md:pb-[80px] md:pt-[56px]">
      <LpContainer>
        <SectionHeading
          eyebrow={content.eyebrow}
          heading={content.heading}
          body={content.body}
          align="center"
          className="mx-auto max-w-[760px]"
        />
        <div className="mt-[46px]">
          {content.grid.kind === "models" ? (
            <ModelCards items={content.grid.items} />
          ) : (
            <TileCards items={content.grid.items} columns={content.grid.columns} />
          )}
        </div>
      </LpContainer>
    </section>
  );
}

/* ------------------------------------------------------------------ stats */

export function StatsSection({ content }: { content: LandingPageContent["stats"] }) {
  return (
    <section className="bg-white pb-12 pt-16 md:pt-[76px]">
      <LpContainer>
        <SectionHeading
          eyebrow={content.eyebrow}
          heading={content.heading}
          align="center"
          className="mx-auto max-w-[700px]"
        />
        <dl
          className={clsx(
            "mt-12 grid grid-cols-2 gap-x-4 gap-y-10 text-center sm:grid-cols-3",
            content.items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5"
          )}
        >
          {content.items.map((stat) => {
            // "30 days" / "5.5 hrs" / "5+ yrs": the design sets the figure at
            // 72px and its unit at 48px, which is what keeps these on one line.
            const [figure, ...rest] = stat.value.split(" ");
            const unit = rest.join(" ");
            return (
              <div key={stat.label} className="px-2">
                <dt className="sr-only">{stat.label.replace(/\n/g, " ")}</dt>
                <dd>
                  {/* nowrap matches the design, which lets a long value spill
                      past its column padding rather than break onto two lines. */}
                  <span className="block whitespace-nowrap font-semibold leading-none text-lp-blue">
                    <span className="text-[clamp(2.75rem,6vw,4.5rem)]">{figure}</span>
                    {unit ? (
                      <span className="text-[clamp(1.85rem,4vw,3rem)]"> {unit}</span>
                    ) : null}
                  </span>
                  <span className="mt-2 block whitespace-pre-line text-[14px] font-medium leading-[21px] text-lp-slate">
                    {stat.label}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </LpContainer>
    </section>
  );
}

/* ---------------------------------------------------------------- process */

export function ProcessSection({ content }: { content: LandingPageContent["process"] }) {
  const last = content.steps.length - 1;
  return (
    <section id="process" className="bg-lp-chip py-16 md:py-[80px]">
      <LpContainer>
        <SectionHeading
          eyebrow={content.eyebrow}
          heading={content.heading}
          body={content.body}
          className="max-w-[660px]"
        />
        <ol className="mt-[46px] grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {content.steps.map((step, i) => (
            <li key={step} className="relative rounded-lg bg-white p-5">
              {/* The rail is drawn per card and overhangs into the 24px gap, so
                  the segments chain into one continuous line across the row —
                  the same construction as the Figma frame. */}
              <span
                aria-hidden="true"
                className={clsx(
                  "absolute top-[42px] hidden h-1 bg-[#abbcff] lg:block",
                  i === 0 && "left-[68px] w-[calc(100%-44px)]",
                  i > 0 && i < last && "left-0 w-[calc(100%+24px)]",
                  i === last && "left-0 w-[68px]"
                )}
              />
              <span className="relative flex size-12 items-center justify-center rounded-2xl bg-lp-blue text-[16px] font-bold leading-none text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="relative pt-6 text-[20px] font-bold leading-[24.8px] text-lp-navy">
                {step}
              </h3>
            </li>
          ))}
        </ol>
      </LpContainer>
    </section>
  );
}
