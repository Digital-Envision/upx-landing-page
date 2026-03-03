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
      ref={sectionRef}
      className="relative overflow-hidden rounded-3xl mx-4 my-8 md:mx-8 lg:mx-16"
      style={{ backgroundColor: "#FFF3E0", minHeight: 500 }}
    >
      {/* Left lightning bolt — bigger */}
      <motion.div
        className="pointer-events-none absolute -bottom-8 -left-4 sm:left-2 lg:left-[8%]"
        initial={{ x: -120, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: -120, opacity: 0 }}
        transition={boltTransition}
        aria-hidden="true"
      >
        <Image
          src="/illustrations/cta-lightning.png"
          alt=""
          width={400}
          height={600}
          className="h-[240px] w-auto drop-shadow-xl sm:h-[300px] lg:h-[400px]"
        />
      </motion.div>

      {/* Right lightning bolt (mirrored) — bigger */}
      <motion.div
        className="pointer-events-none absolute -bottom-8 -right-4 sm:right-2 lg:right-[8%]"
        initial={{ x: 120, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: 120, opacity: 0 }}
        transition={{ ...boltTransition, delay: 0.35 }}
        aria-hidden="true"
      >
        <Image
          src="/illustrations/cta-lightning.png"
          alt=""
          width={400}
          height={600}
          className="h-[240px] w-auto scale-x-[-1] drop-shadow-xl sm:h-[300px] lg:h-[400px]"
        />
      </motion.div>

      {/* Centered text content */}
      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center md:py-32 lg:px-8"
        initial={{ y: 40, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.3 }}
      >
        <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl md:text-6xl">
          Let&apos;s turbocharge
        </h2>
        <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl md:text-6xl">
          your tech team today
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-[#555]">
          Move faster, ship better, and keep costs under control
        </p>
        <div className="mt-10">
          <a
            href="https://calendar.google.com"
            className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-8 py-4 text-base font-medium text-white transition-all hover:bg-black hover:shadow-xl hover:scale-[1.02]"
          >
            Book discovery call
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
