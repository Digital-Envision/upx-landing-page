"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#case-studies", label: "Case Studies" },
];

const emptySubscribe = () => () => {};

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-border-light"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </>
          )}
        </svg>
      </button>

      {/* Portal the overlay + panel to document.body to escape header stacking context */}
      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] lg:hidden"
            onClick={() => setOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Panel */}
            <div
              className="absolute inset-y-0 right-0 z-10 flex w-full max-w-xs flex-col bg-white shadow-2xl dark:bg-slate-950"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button inside panel */}
              <div className="flex justify-end px-6 pt-5">
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-border-light"
                  aria-label="Close menu"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-6 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-border-light"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-6 px-4">
                  <Button
                    as="a"
                    href="https://calendar.google.com"
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    Book Discovery Call
                  </Button>
                </div>
              </nav>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
