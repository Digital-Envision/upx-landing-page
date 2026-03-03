"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const painPoints = [
  {
    headline: "You want to ship fast, but hiring locally takes too long",
    description:
      "Recruiting seniors takes months, and onboarding plus team cohesion add further delays before you see results",
    image: "/illustrations/pain-time.png",
    imageAlt: "Calendar and clock showing wasted time",
  },
  {
    headline: "It also burns through your runway a lot faster",
    description:
      "Senior developers drain budget quickly — burning cash before your team even has the chance to scale",
    image: "/illustrations/pain-money.png",
    imageAlt: "Burning money with declining chart",
  },
  {
    headline:
      "Skip the hiring cycle — scale today with a team that plugs right in",
    description:
      "No drawn-out hiring cycles, no messy onboarding. Our teams are built to integrate seamlessly with yours from day one.",
    image: "/illustrations/pain-puzzle.png",
    imageAlt: "Puzzle pieces connecting seamlessly",
  },
  {
    headline: "And maximise your budget with rockstar developers",
    description:
      "Senior teams of devs, QA, and PMs who've shipped together before — cohesive, proven, and delivering from day one.",
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
    <div ref={blockRef} className="py-[10vh] md:py-[12vh]">
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
      {/* Parallax blocks — no header section, straight into blocks like TurboTeam */}
      {painPoints.map((point, index) => (
        <ParallaxBlock key={index} point={point} />
      ))}
    </section>
  );
}
