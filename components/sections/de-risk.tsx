"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const items = [
  {
    title: "No black box",
    description:
      "Engineers communicate directly in your Slack channels and GitHub repos — no account-manager telephone game, no weekly summary PDFs. You always know what's being built and why.",
  },
  {
    title: "Quality gates on every PR",
    description:
      "Every change goes through peer code review, automated checks, and QA sign-off before it ships. Nothing bypasses the process because of deadline pressure.",
  },
  {
    title: "Security hygiene built in",
    description:
      "Least-privilege access, secrets management, dependency scanning, branch protections, and logging/PII discipline are part of how we work — not an afterthought.",
  },
  {
    title: "Continuity if someone leaves",
    description:
      "Documentation habits, ADRs, and runbooks are part of the team's operating rhythm. If someone leaves, their replacement gets up to speed in days — not months.",
  },
  {
    title: "Predictable delivery, week to week",
    description:
      "Weekly sprint reports, transparent cycle time data, and clear scope control mean you always know what's on track and what needs a decision — before it becomes a problem.",
  },
];

export function DeRiskSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className="bg-[#FAFBFF] py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ y: 24, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl">
            How we prevent the usual outsourcing failure modes
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#555]">
            Most outsourcing fails for predictable reasons. Here&apos;s how we&apos;ve designed against each one.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          className="space-y-3"
          initial={{ y: 16, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                  isOpen
                    ? "border-[#2248F3]/30 bg-white shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <button
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="pr-8 text-base font-semibold text-[#1a1a1a]">
                    {item.title}
                  </span>
                  <span className="ml-auto shrink-0">
                    <svg
                      className={`h-5 w-5 text-[#555] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="border-t border-gray-100 px-6 pb-5 pt-4">
                        <p className="text-sm leading-relaxed text-[#555]">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
