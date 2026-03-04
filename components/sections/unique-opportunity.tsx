"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const mechanisms = [
  {
    number: "01",
    title: "Interview-first",
    description:
      "You meet and interview the engineers before they join your team. No surprises, no black-box matching — you choose who you work with.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Embedded delivery",
    description:
      "Your tools, your standards, your PR process. Engineers live in your Jira, GitHub, and Slack — not in a separate vendor system you have to chase for updates.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Stability by design",
    description:
      "Teams that stay together, stay with you. We build pods designed for continuity — so knowledge compounds instead of walking out the door with every contractor.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

export function UniqueOpportunitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className="bg-white py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ y: 24, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl">
            A dedicated pod that plugs into your workflow —{" "}
            <span className="bg-gradient-to-r from-[#2248F3] to-[#5EDFFF] bg-clip-text text-transparent">
              and stays
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#555]">
            Every pod is built from senior engineers (7+ years) who&apos;ve shipped together before — integrated into your existing workflow from day one.
          </p>
        </motion.div>

        {/* 3-column mechanism cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {mechanisms.map((item, i) => (
            <motion.div
              key={item.number}
              initial={{ y: 32, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 32, opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1 + i * 0.1,
              }}
              className="animated-border-card relative p-8"
            >
              <span className="mb-4 block text-5xl font-black text-[#2248F3]/30 leading-none">
                {item.number}
              </span>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4ff] text-[#2248F3]">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#555]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
