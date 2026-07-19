"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function VideoShowcaseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="bg-[#0a0e1f] py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ y: 24, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#5EDFFF]">
            Watch
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            See how it{" "}
            <span className="bg-gradient-to-r from-[#2248F3] to-[#5EDFFF] bg-clip-text text-transparent">
              actually works
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            A two-minute look at how our pods embed into your team, ship in your workflow, and stay for the long haul.
          </p>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ y: 32, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 32, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-[#2248F3]/20"
        >
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube-nocookie.com/embed/uHBVbuWWHXo?rel=0"
              title="Upscalix — how it works"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
