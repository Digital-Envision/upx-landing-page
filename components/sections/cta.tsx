"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

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
      className="relative overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: "#FFF8F0", minHeight: 400 }}
    >
      {/* Left lightning bolt */}
      <motion.div
        className="pointer-events-none absolute -bottom-10 -left-6 sm:left-0 lg:left-[5%]"
        initial={{ x: -100, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
        transition={boltTransition}
        aria-hidden="true"
      >
        <Image
          src="/illustrations/cta-lightning.png"
          alt=""
          width={300}
          height={450}
          className="h-[200px] w-auto drop-shadow-lg sm:h-[260px] lg:h-[320px]"
        />
      </motion.div>

      {/* Right lightning bolt (mirrored) */}
      <motion.div
        className="pointer-events-none absolute -bottom-10 -right-6 sm:right-0 lg:right-[5%]"
        initial={{ x: 100, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
        transition={{ ...boltTransition, delay: 0.35 }}
        aria-hidden="true"
      >
        <Image
          src="/illustrations/cta-lightning.png"
          alt=""
          width={300}
          height={450}
          className="h-[200px] w-auto scale-x-[-1] drop-shadow-lg sm:h-[260px] lg:h-[320px]"
        />
      </motion.div>

      {/* Centered text content */}
      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8"
        initial={{ y: 40, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-[#333] sm:text-4xl md:text-5xl">
          Let&apos;s turbocharge your
          <br />
          tech team today
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-gray-500">
          Move faster, ship better, and keep costs under control.
        </p>
        <div className="mt-10">
          <Button as="a" href="https://calendar.google.com" size="lg">
            Book Discovery Call
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
