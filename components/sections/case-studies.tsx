"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const caseStudies = [
  {
    company: "Sophiie.ai",
    industry: "Voice AI",
    logo: "/illustrations/logo-sophiie.webp",
    demo: "/illustrations/demo-sophiie.webp",
    description: () => (
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#555] sm:mt-6 sm:space-y-4 sm:text-lg md:text-xl">
        <p>AI virtual receptionist that answers calls instantly, books appointments, and handles enquiries 24/7 — built for service-based businesses.</p>
        <p>Sophiie raised <strong>$1.8M</strong> within 12 months, and an additional <strong>$3.2M</strong> just 6 months later.</p>
      </div>
    ),
    cardBg: "bg-[#FFF8F0]",
  },
  {
    company: "Erin Living",
    industry: "PropTech",
    logo: "/illustrations/logo-erin.webp",
    demo: "/illustrations/demo-erin.webp",
    description: () => (
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#555] sm:mt-6 sm:space-y-4 sm:text-lg md:text-xl">
        <p>Resident management super app for modern residential communities — connecting residents, property managers, and developers through a single platform for amenities, security, and community services.</p>
        <p>Erin raised <strong>$4M</strong> with Origin Energy after 3 years working with us. They now have a team of <strong>7</strong> and we are on track to grow the team further.</p>
      </div>
    ),
    cardBg: "bg-[#F0F4FF]",
  },
  {
    company: "ENPNT",
    industry: "Dance Tech",
    logo: "/illustrations/logo-enpnt.webp",
    demo: "/illustrations/demo-enpnt.webp",
    description: () => (
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#555] sm:mt-6 sm:space-y-4 sm:text-lg md:text-xl">
        <p>Australia&apos;s largest dance directory — connecting dancers with studios nationwide and providing dance schools with management software to run their business efficiently.</p>
        <p>ENPNT raised <strong>$2M</strong> only after 1 year working with us, and are on track to penetrate the US market with the Upscalix team powering the platform.</p>
      </div>
    ),
    cardBg: "bg-[#FEF2F8]",
  },
];

function StackingCard({
  study,
  index,
  total,
}: {
  study: (typeof caseStudies)[number];
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start 20%"],
  });

  // Each card scales down slightly as it "settles" into the stack
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.4, 1]);

  return (
    <div
      ref={cardRef}
      className="sticky"
      style={{ top: `calc(2rem + ${index * 16}px)`, zIndex: index }}
    >
      <motion.div
        style={{ scale, opacity }}
        className={`overflow-hidden rounded-3xl ${study.cardBg} p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-10 md:p-14`}
      >
        <div className="flex flex-col gap-6 sm:gap-10 md:flex-row md:items-center md:gap-16">
          {/* Monitor mockup — bigger */}
          <div className="flex shrink-0 items-center justify-center md:w-[55%]">
            <div className="relative h-[200px] w-full max-w-[600px] sm:h-[320px] md:h-[400px]">
              <Image
                src={study.demo}
                alt={`${study.company} application dashboard`}
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <span className="inline-block rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-[#1a1a1a]">
              {study.industry}
            </span>
            <div className="mt-4">
              <Image
                src={study.logo}
                alt={`${study.company} logo`}
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </div>
            {study.description()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function CaseStudiesSection() {
  return (
    <section id="case-studies" className="bg-white py-12 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-8 text-center sm:mb-16">
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
              Trusted by fast-growing companies worldwide
            </h1>
          </div>
        </AnimateOnScroll>

        {/* Stacking case study cards */}
        <div className="space-y-8 pb-16">
          {caseStudies.map((study, index) => (
            <StackingCard
              key={study.company}
              study={study}
              index={index}
              total={caseStudies.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
