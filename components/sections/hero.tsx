"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const characterEntrance = {
  initial: { y: 120, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    type: "spring" as const,
    stiffness: 200,
    damping: 60,
    mass: 2,
    delay: 0.6,
  },
};

export function HeroSection() {
  const { scrollY } = useScroll();

  const leftParallaxY = useTransform(scrollY, [0, 600], [0, -100]);
  const rightParallaxY = useTransform(scrollY, [0, 600], [0, -80]);

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#f8faff] via-white to-white pt-8 pb-48 md:pt-16 md:pb-64 lg:pb-72">
      {/* Subtle dot pattern background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #2248F3 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Centered text content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="flex flex-col items-center text-center">
            <h1 className="max-w-5xl text-[2.75rem] leading-[1.1] font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              <span className="sm:whitespace-nowrap bg-gradient-to-r from-[#1a1a1a] via-[#2248F3] to-[#5EDFFF] bg-clip-text text-transparent">
                Ship your roadmap faster
              </span>{" "}
              <span className="text-[#1a1a1a]">with a stable senior dev team (embedded, not black-boxed)</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#555] md:text-xl">
              Interview-first senior engineers in Indonesia, integrated into your Jira/GitHub workflow with direct communication, code reviews, and quality gates from day one.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="https://calendar.google.com"
                className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-8 py-4 text-base font-medium text-white transition-all hover:bg-black hover:shadow-xl hover:scale-[1.02]"
              >
                Book a 15-minute Technical Fit Call
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <button className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] px-8 py-4 text-base font-medium text-[#1a1a1a] transition-all hover:bg-[#f0f0f0] hover:scale-[1.02]">
                &ldquo;First 10 Days&rdquo; onboarding plan
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Left character — flush left, aligned with subtitle */}
      <motion.div
        className="absolute bottom-0 left-0 z-0 md:bottom-[15%]"
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
            width={600}
            height={600}
            priority
            sizes="(min-width: 1280px) 480px, (min-width: 768px) 360px, 160px"
            className="w-[160px] drop-shadow-2xl md:w-[360px] lg:w-[480px]"
          />
        </motion.div>
      </motion.div>

      {/* Right character — flush right, aligned with subtitle */}
      <motion.div
        className="absolute bottom-0 right-0 z-0 md:bottom-[15%]"
        style={{ y: rightParallaxY }}
      >
        <motion.div
          initial={characterEntrance.initial}
          animate={characterEntrance.animate}
          transition={{ ...characterEntrance.transition, delay: 0.8 }}
        >
          <Image
            src="/illustrations/team-male-2.png"
            alt="Senior developer character"
            width={600}
            height={600}
            priority
            sizes="(min-width: 1280px) 480px, (min-width: 768px) 360px, 160px"
            className="w-[160px] drop-shadow-2xl md:w-[360px] lg:w-[480px]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
