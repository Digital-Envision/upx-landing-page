import Link from "next/link";
import { Logo } from "@/components/logo";
import { MobileMenu } from "./mobile-menu";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#case-studies", label: "Case Studies" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo width={130} height={34} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-border-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA - Dark button like TurboTeam */}
        <div className="hidden lg:flex">
          <a
            href="https://calendar.google.com"
            className="inline-flex items-center rounded-full bg-[#1a1a1a] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-black hover:shadow-lg"
          >
            Book discovery call
          </a>
        </div>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </header>
  );
}
