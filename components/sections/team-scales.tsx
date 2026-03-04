"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Technical Fit Call (15 mins)",
    description:
      "We align on your stack, constraints, team size, and what \"good\" looks like for your roadmap. Quick and direct — no sales deck.",
  },
  {
    number: "02",
    title: "Engineer Matching (interview-first)",
    description:
      "We shortlist engineers matched to your stack and culture. You interview them. You decide who joins your pod — no surprises.",
  },
  {
    number: "03",
    title: "Week 1 Integration",
    description:
      "Access, environments, coding standards, Slack, GitHub — all set up in the first week. First PRs land before the end of week one.",
  },
  {
    number: "04",
    title: "Delivery Cadence",
    description:
      "Weekly planning, daily async standups, shipping increments, and transparent velocity reporting — every sprint, from day one.",
  },
];

export function TeamScalesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ y: 24, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.1 }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl">
            How we start
            <br />
            <span className="bg-gradient-to-r from-[#2248F3] to-[#5EDFFF] bg-clip-text text-transparent">
              (without a long vendor onboarding)
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[#555]">
            From first call to first commit in 2–4 weeks. Here&apos;s exactly what that looks like.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="flex gap-6"
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 35,
                delay: 0.2 + i * 0.1,
              }}
            >
              <div className="shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2248F3] text-white">
                  <span className="text-sm font-bold">{step.number}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#555]">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
