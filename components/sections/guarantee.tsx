"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const guarantees = [
  {
    title: "30-Day Fit Guarantee",
    description:
      "If it's not a fit in the first 30 days, we'll either replace the engineer at no cost or credit the month. No disputes, no process — just a fix.",
  },
  {
    title: "Replacement SLA",
    description:
      "If someone leaves, we provide a replacement within 10 business days with a full handover overlap. Your project doesn't stall — we absorb the transition.",
  },
  {
    title: "Direct access, always",
    description:
      "You have direct Slack/GitHub access to every engineer on your pod. If something feels off, you talk to the engineer — not a support ticket.",
  },
];

export function GuaranteeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="bg-white py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#f0f4ff] via-white to-[#e8f8ff] border border-[#2248F3]/10 p-10 md:p-16">
          {/* Header */}
          <motion.div
            className="mb-12 text-center"
            initial={{ y: 24, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2248F3]/10 px-4 py-1.5 text-sm font-semibold text-[#2248F3]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Risk Reversal
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl">
              The &ldquo;No-Drama&rdquo; Guarantee
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#555]">
              Saying yes should feel safe. We&apos;ve thought about what happens when things go wrong — before you have to ask.
            </p>
          </motion.div>

          {/* Guarantee cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {guarantees.map((item, i) => (
              <motion.div
                key={item.title}
                className="animated-border-card p-7"
                initial={{ y: 24, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.1 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f4ff]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2248F3" strokeWidth="2" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#1a1a1a]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#555]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
