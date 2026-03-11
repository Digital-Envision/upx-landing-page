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
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-[#555] md:text-xl">
        <p>AI virtual receptionist that answers calls instantly, books appointments, and handles enquiries 24/7 — built for service-based businesses.</p>
        <p>Sophiie raised <strong>$1.2M</strong> within 12 months, and an additional <strong>$2M</strong> just 6 months later.</p>
      </div>
    ),
    cardBg: "bg-[#FFF8F0]",
  },
  {
    company: "EduPlatform",
    industry: "Edtech",
    logo: "/illustrations/case-study-logo-edtech.png",
    demo: "/illustrations/demo-sophiie.webp",
    description: () => (
      <div className="mt-6 text-lg leading-relaxed text-[#555] md:text-xl">
        <p>Education platform for secondary schools, providing interactive revision tools and resources to over 500,000 students and teachers.</p>
      </div>
    ),
    cardBg: "bg-[#F0F4FF]",
  },
  {
    company: "ShopLocal",
    industry: "Marketplace",
    logo: "/illustrations/case-study-logo-marketplace.png",
    demo: "/illustrations/demo-sophiie.webp",
    description: () => (
      <div className="mt-6 text-lg leading-relaxed text-[#555] md:text-xl">
        <p>Australian restaurant-tech platform using dynamic pricing to fill empty tables, serving 2M+ users across 3,000+ venues.</p>
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
    offset: ["start end", "start start"],
  });

  // Each card scales down slightly as it "settles" into the stack
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 1]);

  return (
    <div
      ref={cardRef}
      className="sticky"
      style={{ top: `${120 + index * 24}px`, zIndex: index }}
    >
      <motion.div
        style={{ scale, opacity }}
        className={`overflow-hidden rounded-3xl ${study.cardBg} p-10 shadow-sm transition-shadow duration-300 hover:shadow-lg md:p-14`}
      >
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
          {/* Monitor mockup — bigger */}
          <div className="flex shrink-0 justify-center md:w-[55%]">
            <Image
              src={study.demo}
              alt={`${study.company} application dashboard`}
              width={1200}
              height={1200}
              className="w-full max-w-[600px] drop-shadow-lg"
            />
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
    <section id="case-studies" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-16 text-center">
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
