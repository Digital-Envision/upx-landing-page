"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const painPoints = [
  {
    label: "The Problem",
    headline: "You want to ship fast, but hiring locally takes too long",
    description:
      "Recruiting senior developers takes months, and onboarding plus team cohesion add further delays before you see results.",
    image: "/illustrations/pain-time.png",
    imageAlt: "Calendar and clock showing wasted time",
    labelColor: "text-red-500",
  },
  {
    label: "The Cost",
    headline: "It also burns through your runway a lot faster",
    description:
      "Senior developers drain budgets quickly — burning cash before your team even has the chance to scale and deliver results.",
    image: "/illustrations/pain-money.png",
    imageAlt: "Burning money with declining chart",
    labelColor: "text-amber-500",
  },
  {
    label: "The Solution",
    headline:
      "Skip the hiring cycle — scale today with a team that plugs right in",
    description:
      "No drawn-out hiring cycles, no messy onboarding. Our teams are built to integrate seamlessly with yours from day one.",
    image: "/illustrations/pain-puzzle.png",
    imageAlt: "Puzzle pieces connecting seamlessly",
    labelColor: "text-emerald-500",
  },
  {
    label: "The Result",
    headline: "And maximise your budget with rockstar developers",
    description:
      "Senior teams of devs, QA, and PMs who've shipped together before — cohesive, proven, and delivering from day one.",
    image: "/illustrations/pain-team.png",
    imageAlt: "Superhero developer team",
    labelColor: "text-blue-500",
  },
];

function ParallaxBlock({
  point,
}: {
  point: (typeof painPoints)[number];
}) {
  const blockRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start end", "end start"],
  });

  // Image moves at ~0.3x scroll speed for parallax feel
  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div ref={blockRef} className="py-[20vh]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-20">
          {/* Image — left side, sticky + parallax */}
          <div className="flex w-full justify-center lg:sticky lg:top-[30vh] lg:w-[40%]">
            <motion.div style={{ y: imageY }}>
              <Image
                src={point.image}
                alt={point.imageAlt}
                width={600}
                height={600}
                className="h-[250px] w-[250px] object-contain drop-shadow-2xl sm:h-[300px] sm:w-[300px] lg:h-[400px] lg:w-[400px]"
              />
            </motion.div>
          </div>

          {/* Text — right side */}
          <AnimateOnScroll variant="steps" className="w-full text-center lg:w-[50%] lg:text-left">
            <span
              className={`text-sm font-bold uppercase tracking-[0.15em] ${point.labelColor}`}
            >
              {point.label}
            </span>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-[#333] sm:text-4xl lg:text-5xl">
              {point.headline}
            </h3>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-500 mx-auto lg:mx-0">
              {point.description}
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </div>
  );
}

export function PainPointsSection() {
  return (
    <section id="how-it-works" className="bg-white">
      {/* Section header */}
      <div className="py-24 md:py-32">
        <AnimateOnScroll>
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
              Why Upscalix
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#333] sm:text-4xl md:text-5xl">
              The struggle of scaling your dev team
            </h2>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Parallax blocks */}
      {painPoints.map((point, index) => (
        <ParallaxBlock key={index} point={point} />
      ))}
    </section>
  );
}
