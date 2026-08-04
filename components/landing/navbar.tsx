import Image from "next/image";
import Link from "next/link";
import { LpContainer } from "./ui";
import { LandingMobileMenu } from "./mobile-menu";

interface NavbarProps {
  links: { label: string; href: string }[];
  cta: { label: string; href: string };
}

export function LandingNavbar({ links, cta }: NavbarProps) {
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

        <a
          href={cta.href}
          className="hidden shrink-0 rounded-[5px] bg-lp-navy px-[30px] py-[10px] text-[14px] font-bold uppercase text-white drop-shadow-[0px_10px_12.5px_rgba(14,30,57,0.25)] transition-colors hover:bg-[#16294a] lg:block"
        >
          {cta.label}
        </a>

        <LandingMobileMenu links={links} cta={cta} />
      </LpContainer>
    </header>
  );
}
