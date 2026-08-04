"use client";

import { useEffect, useState } from "react";

interface Props {
  links: { label: string; href: string }[];
  cta: { label: string; href: string };
}

/**
 * The Figma frame is desktop-only, so the small-screen treatment is a
 * disclosure panel over the same links. Kept as the page's only nav-level
 * client component.
 */
export function LandingMobileMenu({ links, cta }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="landing-mobile-nav"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-lp-navy hover:bg-lp-mist"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open ? (
        <div
          id="landing-mobile-nav"
          className="absolute inset-x-0 top-[80px] z-50 border-y border-lp-line bg-white px-6 py-4 shadow-lg"
        >
          <nav aria-label="Page sections" className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-lp-line py-3 text-[14px] text-lp-navy last:border-b-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href={cta.href}
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-[5px] bg-lp-navy px-[30px] py-[12px] text-center text-[14px] font-bold uppercase text-white"
          >
            {cta.label}
          </a>
        </div>
      ) : null}
    </div>
  );
}
