"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const faqs = [
  {
    question: "How quickly can a team start?",
    answer:
      "Most teams are ready to kick off within 1-2 weeks. We match your requirements with pre-vetted senior engineers who have already worked together, so there's no lengthy recruitment or onboarding process.",
  },
  {
    question: "What roles are included?",
    answer:
      "Every team comes with senior fullstack developers, a technical lead / PM, and a QA engineer. You get a complete squad — not just individual contributors.",
  },
  {
    question: "How do I know the team is good?",
    answer:
      "Every team follows strict engineering practices: code reviews on every PR, automated testing (unit, integration, E2E), CI/CD pipelines, and thorough documentation. You can also interview team members before kicking off.",
  },
  {
    question: "Who manages the team day to day?",
    answer:
      "Your dedicated Technical Lead / PM handles day-to-day management, including standups, sprint planning, and ensuring delivery stays on track.",
  },
  {
    question: "How do we work with the team?",
    answer:
      "We integrate directly into your existing workflow — Slack, Microsoft Teams, Jira, Linear, or whatever tools you use. Daily standups, weekly demos, and transparent communication.",
  },
  {
    question: "Can we scale up or down?",
    answer:
      "Yes. After the initial 3-month minimum term, you can scale up, scale down, or pause at any time with 30 days' notice.",
  },
  {
    question: "Do we need to manage HR, payroll, or benefits?",
    answer:
      "No. We handle all HR, payroll, benefits, and performance management. You only pay a simple monthly team rate.",
  },
  {
    question: "How do time zones work?",
    answer:
      "Our teams are based in Indonesia (WIB/WITA), which provides a 4-hour overlap with AEST. Teams adjust their schedules to maximise overlap with your core working hours.",
  },
  {
    question: "How do you ensure quality?",
    answer:
      "Code reviews on every PR, automated testing, CI/CD pipelines, and documentation. Our Technical Leads ensure architectural consistency and best practices across all projects.",
  },
  {
    question: "What if someone leaves?",
    answer:
      "We handle all replacements quickly — typically within 1-2 weeks — at no additional cost to you. Our teams are built for stability and continuity.",
  },
];

export function FAQSection() {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  return (
    <section className="bg-[#FAFBFF] py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl md:text-6xl">
              FAQ
            </h1>
          </div>
        </AnimateOnScroll>

        {/* Accordion */}
        <AnimateOnScroll>
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndices.has(index);
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
                    onClick={() => setOpenIndices((prev) => {
                      const next = new Set(prev);
                      if (next.has(index)) next.delete(index);
                      else next.add(index);
                      return next;
                    })}
                    aria-expanded={isOpen}
                  >
                    <span className="pr-8 text-base font-semibold text-[#1a1a1a]">
                      {faq.question}
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
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
