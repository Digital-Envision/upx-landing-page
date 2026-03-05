"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const painPoints = [
  {
    headline: "Senior hires take months, then weeks to ramp",
    description:
      "Recruiting senior staff takes 3–6 months on average. Then comes onboarding, team cohesion, ramp time — all before you see a single commit land in production.",
    image: "/illustrations/pain-time.png",
    imageAlt: "Calendar and clock showing wasted time",
  },
  {
    headline: "Contractors churn and take context with them",
    description:
      "Contractors leave when a better rate appears. And when they go, they take the architecture knowledge, the edge cases, and the delivery momentum with them.",
    image: "/illustrations/pain-money.png",
    imageAlt: "Burning money with declining chart",
  },
  {
    headline: "Roadmap expands faster than headcount",
    description:
      "Product keeps adding scope. Engineering capacity stays flat. The backlog grows. Velocity drops. The team burns out trying to keep up.",
    image: "/illustrations/pain-puzzle.png",
    imageAlt: "Puzzle pieces connecting seamlessly",
  },
  {
    headline: "Tech debt grows while Product wants 'one more thing'",
    description:
      "Every sprint is a negotiation between stability and speed. Without a stable senior team, quality gets sacrificed to hit deadlines — and the debt compounds.",
    image: "/illustrations/pain-team.png",
    imageAlt: "Superhero developer team",
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

  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <div ref={blockRef} className="py-[2.5vh] md:py-[3vh]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-24">
          {/* Image — left side, bigger */}
          <div className="flex w-full justify-center lg:w-[45%]">
            <motion.div style={{ y: imageY }}>
              <Image
                src={point.image}
                alt={point.imageAlt}
                width={600}
                height={600}
                className="h-[336px] w-[336px] object-contain drop-shadow-2xl sm:h-[408px] sm:w-[408px] lg:h-[528px] lg:w-[528px]"
              />
            </motion.div>
          </div>

          {/* Text — right side, bolder */}
          <AnimateOnScroll variant="steps" className="w-full text-center lg:w-[50%] lg:text-left">
            <h3 className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {point.headline}
            </h3>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#555] mx-auto lg:mx-0">
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
    <section id="how-it-works" className="bg-[#FAFBFF]">
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-4 text-center lg:px-8">
        <AnimateOnScroll>
          <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl">
            If you&apos;re hiring in Australia, you already know the pain
          </h2>
        </AnimateOnScroll>
      </div>

      {/* Parallax blocks */}
      {painPoints.map((point, index) => (
        <ParallaxBlock key={index} point={point} />
      ))}

      {/* Bridge line */}
      <div className="mx-auto max-w-3xl px-6 pb-24 text-center lg:px-8">
        <AnimateOnScroll>
          <p className="text-xl font-medium leading-relaxed text-[#1a1a1a] sm:text-2xl">
            You don&apos;t need &ldquo;more outsourcing.&rdquo; You need{" "}
            <span className="bg-gradient-to-r from-[#2248F3] to-[#5EDFFF] bg-clip-text text-transparent">
              a second team that compounds knowledge
            </span>{" "}
            and ships predictably.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
