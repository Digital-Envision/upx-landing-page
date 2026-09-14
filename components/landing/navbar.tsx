import Image from "next/image";
import { clsx } from "clsx";
import Link from "next/link";
import { LpContainer } from "./ui";
import { LandingMobileMenu } from "./mobile-menu";

interface NavbarProps {
  links: { label: string; href: string }[];
  cta: { label: string; href: string };
}

export function LandingNavbar({ links, cta }: NavbarProps) {
  // The newer frames draw the header as just the logo and the booking button.
  // With nothing to navigate to there is no menu to disclose either, so the
  // button comes out from behind the hamburger and shows at every width.
  const hasLinks = links.length > 0;

  return (
    <header className="bg-white">
      <LpContainer className="flex h-[80px] items-center justify-between gap-6 md:h-[100px]">
        <Link href="/" aria-label="Upscalix home" className="shrink-0">
          <Image
            src="/landing/logo-nav.svg"
            alt="Upscalix"
            width={118}
            height={30}
            priority
          />
        </Link>

        {hasLinks ? (
          <nav aria-label="Page sections" className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] text-lp-navy transition-colors hover:text-lp-blue"
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}

        <a
          href={cta.href}
          className={clsx(
            "rounded-[5px] bg-lp-navy px-3 py-[10px] text-center text-[11px] font-bold uppercase leading-[1.2] text-white",
            "drop-shadow-[0px_10px_12.5px_rgba(14,30,57,0.25)] transition-colors hover:bg-[#16294a]",
            "sm:whitespace-nowrap sm:px-[30px] sm:text-[14px]",
            // Without a hamburger to hide behind, the button is on screen at
            // every width — so below sm it has to be allowed to shrink and wrap
            // rather than pushing the page sideways on a 320px phone.
            hasLinks ? "hidden shrink-0 lg:block" : "min-w-0 shrink"
          )}
        >
          {cta.label}
        </a>

        {hasLinks ? <LandingMobileMenu links={links} cta={cta} /> : null}
      </LpContainer>
    </header>
  );
}
