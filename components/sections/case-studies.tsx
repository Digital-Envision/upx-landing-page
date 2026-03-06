"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const caseStudies = [
  {
    company: "FinTrack",
    industry: "Fintech",
    logo: "/illustrations/case-study-logo-fintech.png",
    description:
      "Australian payment automation platform that lets businesses pay any supplier by credit card, streamlining bills and earning rewards.",
    cardBg: "bg-[#FFF8F0]",
  },
  {
    company: "EduPlatform",
    industry: "Edtech",
    logo: "/illustrations/case-study-logo-edtech.png",
    description:
      "Education platform for secondary schools, providing interactive revision tools and resources to over 500,000 students and teachers.",
    cardBg: "bg-[#F0F4FF]",
  },
  {
    company: "ShopLocal",
    industry: "Marketplace",
    logo: "/illustrations/case-study-logo-marketplace.png",
    description:
      "Australian restaurant-tech platform using dynamic pricing to fill empty tables, serving 2M+ users across 3,000+ venues.",
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
          <div className="flex shrink-0 justify-center md:w-[45%]">
            <Image
              src="/illustrations/case-study-monitor.webp"
              alt={`${study.company} application dashboard`}
              width={800}
              height={800}
              className="w-full max-w-[400px] drop-shadow-lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <span className="inline-block rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-[#1a1a1a]">
              {study.industry}
            </span>
            {/* Company logo placeholder */}
            <div className="mt-4 flex h-10 w-36 items-center justify-center rounded-md bg-gray-200/60 text-xs text-gray-400">
              {study.company} logo
            </div>
            <p className="mt-6 text-lg leading-relaxed text-[#555] md:text-xl">
              {study.description}
            </p>
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
