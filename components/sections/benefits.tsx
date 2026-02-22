"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

interface BenefitCard {
  title: string;
  description: string;
  bg: string;
  border: string;
  initialRotate: number;
  initialRotateY: number;
}

const benefits: BenefitCard[] = [
  {
    title: "No HR headaches",
    description:
      "Forget hiring, firing, and performance reviews — we handle it all so you can focus on shipping.",
    bg: "#FEEBD5",
    border: "#FED8AA",
    initialRotate: 8,
    initialRotateY: 18,
  },
  {
    title: "Scale up and down easily",
    description:
      "Add firepower when you need it, trim back when you don't — flexibility built in from day one.",
    bg: "#DBFBE6",
    border: "#BAF6CF",
    initialRotate: -4,
    initialRotateY: 18,
  },
  {
    title: "No hidden employment costs",
    description:
      "Skip superannuation, benefits, and overheads. You only pay for the team — simple, transparent pricing.",
    bg: "#CEF9FD",
    border: "#A5F2FB",
    initialRotate: 2,
    initialRotateY: 10,
  },
  {
    title: "With you for the long haul",
    description:
      "Our teams stay together and stay with you — providing stability, loyalty, and continuity as your roadmap grows.",
    bg: "#ECE8FD",
    border: "#DCD5FD",
    initialRotate: -2,
    initialRotateY: 10,
  },
  {
    title: "Relentless work ethic",
    description:
      "Handpicked from Indonesia's top 1%, our engineers go above and beyond to get the job done right.",
    bg: "#FDE8E8",
    border: "#FBD0D0",
    initialRotate: 2,
    initialRotateY: 8,
  },
  {
    title: "A unit, not individuals",
    description:
      "Every team has shipped products together before — instant cohesion, trust, and speed from day one.",
    bg: "#F9D5D5",
    border: "#F4B8B8",
    initialRotate: -3,
    initialRotateY: 12,
  },
];

// Approximate card-height + gap used to collapse cards into a centered stack
const CARD_STRIDE = 116;

function DealingCard({
  card,
  index,
  total,
  scrollYProgress,
}: {
  card: BenefitCard;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Y offset that collapses every card toward the vertical center of the list
  const centerIndex = (total - 1) / 2;
  const stackedY = (centerIndex - index) * CARD_STRIDE;

  // Each card has a staggered scroll-progress window for its animation
  const animStart = 0.12 + index * 0.1;
  const animEnd = animStart + 0.13;

  const y = useTransform(
    scrollYProgress,
    [0, animStart, animEnd, 1],
    [stackedY, stackedY, 0, 0],
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, animStart, animEnd, 1],
    [card.initialRotate, card.initialRotate, 0, 0],
  );
  const rotateYVal = useTransform(
    scrollYProgress,
    [0, animStart, animEnd, 1],
    [card.initialRotateY, card.initialRotateY, 0, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, animStart, animEnd, 1],
    [0.95, 0.95, 1, 1],
  );

  return (
    <motion.div
      className="w-[92%] max-w-2xl sm:w-[80%] lg:w-[65%]"
      style={{
        y,
        rotate,
        rotateY: rotateYVal,
        scale,
        zIndex: total - index,
      }}
    >
      <div
        className="rounded-2xl border-2 px-6 py-5 shadow-sm"
        style={{ backgroundColor: card.bg, borderColor: card.border }}
      >
        <h3 className="text-lg font-bold text-[#333]">{card.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
          {card.description}
        </p>
      </div>
    </motion.div>
  );
}

export function BenefitsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-white"
      style={{ height: "250vh" }}
    >
      <div className="sticky top-0 flex h-dvh flex-col items-center overflow-clip">
        {/* Heading */}
        <AnimateOnScroll className="shrink-0 px-6 pt-16 pb-4 text-center">
          <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
            Benefits
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#333] sm:text-4xl md:text-5xl">
            Why companies choose Upscalix
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-gray-500">
            Everything you need to scale your engineering team — without the
            overhead.
          </p>
        </AnimateOnScroll>

        {/* Card deck */}
        <div className="flex w-full flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
          <div
            className="flex w-full flex-col items-center gap-3"
            style={{ perspective: 1200 }}
          >
            {benefits.map((card, i) => (
              <DealingCard
                key={card.title}
                card={card}
                index={i}
                total={benefits.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
