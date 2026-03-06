"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const boltTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 40,
  mass: 1,
  delay: 0.2,
};

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      id="final-cta"
      ref={sectionRef}
      className="relative overflow-hidden rounded-3xl mx-4 my-8 md:mx-8 lg:mx-16"
      style={{ backgroundColor: "#FFF3E0", minHeight: 500 }}
    >
      {/* Mobile: single bolt centered above text */}
      <motion.div
        className="relative z-0 mx-auto mt-12 flex justify-center md:hidden"
        initial={{ y: -40, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }}
        transition={boltTransition}
        aria-hidden="true"
      >
        <Image
          src="/illustrations/cta-lightning.webp"
          alt=""
          width={400}
          height={600}
          className="h-[200px] w-auto drop-shadow-xl"
        />
      </motion.div>

      {/* Desktop: left lightning bolt */}
      <motion.div
        className="pointer-events-none absolute -bottom-8 -left-4 hidden sm:left-2 md:block lg:left-[8%]"
        initial={{ x: -120, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: -120, opacity: 0 }}
        transition={boltTransition}
        aria-hidden="true"
      >
        <Image
          src="/illustrations/cta-lightning.webp"
          alt=""
          width={400}
          height={600}
          className="h-[240px] w-auto drop-shadow-xl sm:h-[300px] lg:h-[400px]"
        />
      </motion.div>

      {/* Desktop: right lightning bolt (mirrored) */}
      <motion.div
        className="pointer-events-none absolute -bottom-8 -right-4 hidden sm:right-2 md:block lg:right-[8%]"
        initial={{ x: 120, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: 120, opacity: 0 }}
        transition={{ ...boltTransition, delay: 0.35 }}
        aria-hidden="true"
      >
        <Image
          src="/illustrations/cta-lightning.webp"
          alt=""
          width={400}
          height={600}
          className="h-[240px] w-auto scale-x-[-1] drop-shadow-xl sm:h-[300px] lg:h-[400px]"
        />
      </motion.div>

      {/* Centered text content */}
      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-6 py-12 text-center md:py-32 lg:px-8"
        initial={{ y: 40, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.3 }}
      >
        <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl md:text-6xl">
          Ready to add a senior pod
        </h2>
        <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl md:text-6xl">
          in 2–4 weeks?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-[#555]">
          Book a short technical call. We&apos;ll confirm fit, map the first 2 weeks, and show you exactly how we&apos;ll integrate.
        </p>
        <div className="mt-10">
          <a
            href="https://calendar.google.com"
            className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-8 py-4 text-base font-medium text-white transition-all hover:bg-black hover:shadow-xl hover:scale-[1.02]"
          >
            Book a 15-minute Technical Fit Call
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
