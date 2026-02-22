"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

export function FeaturedTestimonial() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="mb-20 md:mb-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 md:flex-row md:items-start md:gap-0 lg:px-0">
        {/* Character illustration */}
        <motion.div
          className="shrink-0 md:-mr-4"
          initial={{ x: -60, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 35, delay: 0.1 }}
        >
          <Image
            src="/illustrations/team-male.png"
            alt="Joshua Suntup"
            width={400}
            height={400}
            className="h-[220px] w-[220px] object-contain drop-shadow-xl md:h-[280px] md:w-[280px] lg:h-[320px] lg:w-[320px]"
          />
        </motion.div>

        {/* Speech bubble */}
        <motion.div
          className="relative z-10 w-full"
          initial={{ x: 60, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 35, delay: 0.25 }}
        >
          {/* Bubble arrow — points left, hidden on mobile (stacked layout) */}
          <div
            className="absolute -left-2.5 top-10 hidden h-5 w-5 rotate-45 rounded-sm border-b border-l border-gray-200 bg-white md:block"
            aria-hidden="true"
          />

          <div className="rounded-2xl border border-gray-200 bg-white px-8 py-7 shadow-sm">
            <p className="text-lg leading-relaxed text-gray-500 italic">
              &ldquo;I would recommend Upscalix to anyone who wants to scale
              their development team quickly with senior-level talent. The team
              integrated seamlessly, communicated proactively, and delivered
              production-quality code from week one.&rdquo;
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div>
                <p className="font-bold text-[#333]">Joshua Suntup</p>
                <p className="text-sm text-gray-400">
                  Head of Product @ Lessn
                </p>
              </div>

              {/* LinkedIn icon */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto shrink-0 text-gray-300 transition-colors hover:text-[#0A66C2]"
                aria-label="Joshua Suntup on LinkedIn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
