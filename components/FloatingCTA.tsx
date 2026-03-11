"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const finalCta = document.getElementById("final-cta");

    if (!hero || !finalCta) return;

    let heroVisible = true;
    let ctaVisible = false;

    const update = () => {
      setVisible(!heroVisible && !ctaVisible);
    };

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0 }
    );

    const ctaObserver = new IntersectionObserver(
      ([entry]) => {
        ctaVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0 }
    );

    heroObserver.observe(hero);
    ctaObserver.observe(finalCta);

    return () => {
      heroObserver.disconnect();
      ctaObserver.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 z-50 w-full px-4 pb-4 sm:bottom-6 sm:left-1/2 sm:w-auto sm:-translate-x-1/2 sm:px-0 sm:pb-0"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={() => window.open("https://links.cornerstoneandcompass.com/widget/bookings/turbo-team", "_blank")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-7 py-3.5 text-sm font-medium text-white shadow-2xl transition-all hover:bg-black hover:scale-[1.02] sm:w-auto"
          >
            Book a 15-minute Technical Fit Call
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
