import { clsx } from "clsx";

/**
 * Shared primitives for the service landing pages. The Figma design is a
 * 1440px frame with 120px gutters, so the content column caps at 1200px.
 */

export function LpContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-[120px]", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  className,
  tone = "blue",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "blue" | "white";
}) {
  return (
    <p
      className={clsx(
        "text-[14px] font-medium tracking-[2px]",
        // lp-blue-deep rather than lp-blue: at 14px the lighter brand blue
        // falls just under WCAG AA (4.39:1) on the tinted section backgrounds.
        // Both are design-system blues, and the difference is imperceptible.
        tone === "blue" ? "text-lp-blue-deep" : "text-white",
        className
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  heading,
  body,
  align = "left",
  tone = "dark",
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={clsx(
        "flex flex-col",
        centered ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <Eyebrow tone={tone === "light" ? "white" : "blue"} className="mb-4">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Heading
        className={clsx(
          "text-[clamp(1.75rem,4.2vw,2.5rem)] font-bold leading-[1.2] text-balance",
          tone === "light" ? "text-white" : "text-lp-navy"
        )}
      >
        {heading}
      </Heading>
      {body ? (
        <p
          className={clsx(
            "mt-4 max-w-[760px] text-[17px] font-medium leading-[30px] sm:text-[18px]",
            tone === "light" ? "text-lp-navy-body" : "text-lp-slate"
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The primary CTA. The Figma button carries a soft light bloom off its right
 * edge (a 450px ellipse); reproduced here as a radial gradient so it costs
 * nothing to load.
 */
export function CtaButton({
  href,
  children,
  className,
  type,
  disabled,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: "submit";
  disabled?: boolean;
}) {
  const classes = clsx(
    "relative inline-flex h-[56px] items-center justify-center overflow-hidden rounded-[10px]",
    "bg-lp-blue-deep px-8 text-[18px] text-white sm:text-[20px]",
    "shadow-[0px_10px_25px_0px_rgba(62,100,255,0.25)]",
    "transition-colors hover:bg-[#1a38c2]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lp-blue",
    "disabled:cursor-not-allowed disabled:opacity-60",
    className
  );

  const bloom = (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-[40%] top-1/2 aspect-square w-[220%] -translate-y-1/2 rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0) 70%)",
      }}
    />
  );

  if (type === "submit") {
    return (
      <button type="submit" className={classes} disabled={disabled}>
        {bloom}
        <span className="relative">{children}</span>
      </button>
    );
  }

  return (
    <a href={href} className={classes}>
      {bloom}
      <span className="relative">{children}</span>
    </a>
  );
}

/** The circular white icon medallion used on every feature card. */
export function IconMedallion({
  icon: Icon,
  size = 64,
  className,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-white",
        "drop-shadow-[0px_10px_12.5px_rgba(62,100,255,0.25)]",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Icon width={size / 2} height={size / 2} className="text-lp-blue" strokeWidth={1.5} />
    </span>
  );
}
