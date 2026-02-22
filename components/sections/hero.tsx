"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const clientLogos = [
  "Telstra",
  "ANZ",
  "Canva",
  "Atlassian",
  "REA Group",
];

const characterEntrance = {
  initial: { y: 120, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    type: "spring" as const,
    stiffness: 200,
    damping: 60,
    mass: 2,
    delay: 1,
  },
};

export function HeroSection() {
  const { scrollY } = useScroll();

  // Left character drifts up faster for depth
  const leftParallaxY = useTransform(scrollY, [0, 500], [0, -80]);
  // Right character drifts up slightly slower
  const rightParallaxY = useTransform(scrollY, [0, 500], [0, -60]);

  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-40 md:pt-20 md:pb-56 lg:pb-64">
      {/* Subtle background accents */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Centered text content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="flex flex-col items-center text-center">
            <Badge variant="primary" className="mb-6">
              Trusted by Australian businesses
            </Badge>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-[#333] sm:text-5xl md:text-6xl lg:text-7xl">
              A fullstack senior dev team for the price of{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                one local engineer
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-gray-500 md:text-xl">
              Supercharge your tech team, move fast, deliver quality, and keep
              costs down with a battle-tested senior engineering team from
              Indonesia, ready to start today.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Button as="a" href="https://calendar.google.com" size="lg">
                Book Discovery Call
              </Button>
              <Button as="a" href="#pricing" variant="outline" size="lg">
                See Pricing
              </Button>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Client Logo Strip */}
        <AnimateOnScroll className="mt-16 md:mt-20">
          <p className="mb-6 text-center text-sm font-medium text-gray-400">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {clientLogos.map((name) => (
              <span
                key={name}
                className="text-lg font-semibold text-gray-300 transition-colors hover:text-gray-500"
              >
                {name}
              </span>
            ))}
          </div>
        </AnimateOnScroll>
      </div>

      {/* Left character — parallax + entrance */}
      <motion.div
        className="absolute -bottom-8 -left-8 z-0 hidden md:block md:left-0 lg:left-[5%]"
        style={{ y: leftParallaxY }}
      >
        <motion.div
          initial={characterEntrance.initial}
          animate={characterEntrance.animate}
          transition={characterEntrance.transition}
        >
          <Image
            src="/illustrations/team-male.png"
            alt="Senior developer character"
            width={400}
            height={400}
            sizes="(min-width: 1280px) 340px, (min-width: 768px) 260px, 200px"
            className="w-[200px] drop-shadow-2xl md:w-[260px] lg:w-[340px]"
          />
        </motion.div>
      </motion.div>

      {/* Right character — parallax + entrance */}
      <motion.div
        className="absolute -bottom-8 -right-8 z-0 hidden md:block md:right-0 lg:right-[5%]"
        style={{ y: rightParallaxY }}
      >
        <motion.div
          initial={characterEntrance.initial}
          animate={characterEntrance.animate}
          transition={characterEntrance.transition}
        >
          <Image
            src="/illustrations/team-female.png"
            alt="Senior developer character"
            width={400}
            height={400}
            sizes="(min-width: 1280px) 340px, (min-width: 768px) 260px, 200px"
            className="w-[200px] drop-shadow-2xl md:w-[260px] lg:w-[340px]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
