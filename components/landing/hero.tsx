import Image from "next/image";
import { clsx } from "clsx";
import type { LandingPageContent } from "@/lib/landing/content";
import { CtaButton, Eyebrow, LpContainer } from "./ui";

/** Dark navy pill carrying the headline statistic. */
function StatPill({
  stat,
  className,
}: {
  stat: LandingPageContent["hero"]["stat"];
  className?: string;
}) {
  const Icon = stat.icon;
  return (
    <div
      className={clsx(
        "flex items-center gap-4 rounded-full bg-lp-navy px-4 py-2.5",
        "shadow-[0px_20px_20px_rgba(62,100,255,0.25)]",
        className
      )}
    >
      <Icon width={40} height={40} className="shrink-0 text-lp-cyan" />
      <span className="flex items-center gap-2">
        <span className="text-[28px] font-semibold leading-none text-lp-cyan sm:text-[36px]">
          {stat.value}
        </span>
        <span className="whitespace-pre-line text-[10px] font-medium leading-[1.2] text-white">
          {stat.label}
        </span>
      </span>
    </div>
  );
}

/** Light pill with the stacked team avatars. */
function TeamPill({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-4 rounded-full bg-lp-mist py-3 pl-3 pr-6",
        "shadow-[0px_5px_6.9px_rgba(62,100,255,0.2)]",
        className
      )}
    >
      <span className="flex items-center">
        {[1, 2, 3].map((n) => (
          <Image
            key={n}
            src={`/landing/avatar-${n}.webp`}
            alt=""
            width={40}
            height={40}
            className="-mr-4 size-10 rounded-full object-cover last:mr-0"
          />
        ))}
      </span>
      <span className="whitespace-nowrap text-[16px] font-medium text-lp-navy sm:text-[18px]">
        <strong className="font-bold">{label.split(" ")[0]}</strong>
        {label.slice(label.indexOf(" "))}
      </span>
    </div>
  );
}

/** Circular navy badge sitting over the artwork. */
function HeroBadge({
  badge,
  size,
  className,
}: {
  badge: NonNullable<LandingPageContent["hero"]["badge"]>;
  /** The design sizes this differently per page: 84px on page 1, 72px on 2 and 3. */
  size: 72 | 84;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        // overflow-hidden matters for the image badge: the Figma export bakes
        // the navy disc onto an opaque square, so the corners need clipping.
        "inline-flex items-center justify-center overflow-hidden rounded-full bg-lp-navy",
        size === 84 ? "size-[64px] lg:size-[84px]" : "size-[56px] lg:size-[72px]",
        className
      )}
    >
      {badge.kind === "image" ? (
        <Image
          src="/landing/badge-australia-hours.webp"
          alt=""
          width={84}
          height={84}
          className="size-full"
        />
      ) : (
        <badge.icon width={40} height={40} className="text-lp-cyan" strokeWidth={1.5} />
      )}
    </span>
  );
}

export function LandingHero({ content }: { content: LandingPageContent }) {
  const { hero, cta } = content;

  return (
    <section id="hero" className="bg-white pb-12 pt-8 md:pb-[46px] md:pt-[76px]">
      <LpContainer className="flex flex-col items-center gap-12 lg:flex-row lg:gap-6">
        <div className="w-full lg:flex-1">
          <Eyebrow className="mb-4">{hero.eyebrow}</Eyebrow>
          <h1 className="text-[clamp(2rem,5.4vw,3.25rem)] font-bold leading-[1.1] text-balance text-lp-navy">
            {hero.heading}
          </h1>
          <p className="mt-4 max-w-[704px] text-[18px] font-medium leading-[32px] text-lp-slate sm:text-[20px] sm:leading-[36px]">
            {hero.body}
          </p>
          <div className="pt-[30px]">
            <CtaButton href={cta.href}>{cta.label}</CtaButton>
          </div>
        </div>

        {/* Artwork column — a blue panel with the photo breaking out of it,
            plus the floating stat pills from the design. */}
        <div className="relative w-full max-w-[440px] shrink-0 lg:w-[440px]">
          <div className="relative aspect-[440/464]">
            {/* What sits behind the cut-out differs per page: variant a uses a
                flat blue panel, variant b a second photograph, and variant c
                has no backdrop at all (it is a single framed image). */}
            {hero.variant === "a" ? (
              <div className="absolute inset-x-[5%] top-[24%] h-[58%] rounded-[24px] bg-lp-blue" />
            ) : null}
            {hero.backdrop ? (
              <div className="absolute left-[4.77%] top-[24.51%] h-[57.94%] w-[90.49%] overflow-hidden rounded-[24px]">
                <Image
                  src={hero.backdrop.src}
                  alt=""
                  width={hero.backdrop.width}
                  height={hero.backdrop.height}
                  priority
                  sizes="(min-width: 1024px) 400px, 85vw"
                  className="size-full object-cover"
                />
              </div>
            ) : null}

            {/* The photo's box is pinned explicitly rather than via top+bottom:
                next/image carries an intrinsic aspect-ratio, which would win
                over a bottom offset and leave the photo floating above the
                panel instead of sitting flush on it. */}
            <div
              className={clsx(
                // z-10 so the head that breaks out of the frame passes in front
                // of the team pill, matching the Figma layer order.
                "absolute z-10",
                // Variant a insets the photo inside the panel; b fills the
                // panel's full width; c is a framed image rather than a cut-out.
                hero.variant === "a" && "left-[12.5%] top-[13.6%] h-[68.9%] w-[79.5%]",
                hero.variant === "b" && "left-[4.77%] top-[12.72%] h-[69.83%] w-[90.45%]",
                // Variant c's frame is the union of the design's two overlapping
                // clip rects (they show the same photo at the same transform).
                hero.variant === "c" &&
                  "left-[4.773%] top-[4.095%] h-[78.349%] w-[90.455%] overflow-hidden rounded-[24px]"
              )}
            >
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                width={hero.image.width}
                height={hero.image.height}
                priority
                fetchPriority="high"
                // The artwork column caps at 440px and the photo occupies ~80-90%
                // of it, so this tracks the real render width rather than the
                // viewport.
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 400px, 85vw"
                className="size-full object-cover object-bottom"
              />
            </div>

            {hero.badge ? (
              <HeroBadge
                badge={hero.badge}
                size={hero.variant === "a" ? 84 : 72}
                className={clsx(
                  "absolute z-20",
                  hero.variant === "a" && "right-[2%] top-[20%]",
                  hero.variant === "b" && "left-0 top-[28.02%]",
                  hero.variant === "c" && "right-0 top-[17%]"
                )}
              />
            ) : null}

            <StatPill
              stat={hero.stat}
              className={clsx(
                "absolute",
                // Page 1 tucks this behind the artwork so the subject's hair
                // crosses in front of it; page 2 stacks it above. Both follow
                // the layer order in their frame.
                hero.variant === "a" && "z-0 left-0 top-[5%]",
                hero.variant !== "a" && "z-20",
                hero.variant === "b" && "right-[10.9%] top-[76.08%]",
                hero.variant === "c" && "bottom-[12%] left-0"
              )}
            />

            {hero.teamPill ? (
              <TeamPill
                label={hero.teamPill}
                className={clsx(
                  "absolute",
                  // Page 1 stacks this above the artwork; page 2 tucks it behind
                  // so the subject's head overlaps it. Both follow the design.
                  hero.variant === "a" && "z-20 bottom-0 left-[13%]",
                  hero.variant === "b" && "z-0 left-0 top-[4%]"
                )}
              />
            ) : null}
          </div>
        </div>
      </LpContainer>
    </section>
  );
}
