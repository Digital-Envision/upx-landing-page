"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { FeaturedTestimonial } from "@/components/sections/featured-testimonial";

export function TestimonialsSection() {
  const walkleyRef = useRef<HTMLDivElement>(null);
  const walkleyInView = useInView(walkleyRef, { once: true, amount: 0.3 });

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-16 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
              Why our clients love working with us
            </h1>
          </div>
        </AnimateOnScroll>

        {/* Featured testimonial — Jacob Banks */}
        <FeaturedTestimonial />

        {/* Thomas Walkley testimonial */}
        <div ref={walkleyRef} className="mt-24">
          {/* Desktop layout — name left, character + balloon right */}
          <div className="hidden md:flex mx-auto max-w-4xl flex-col items-center md:flex-row md:items-end md:gap-0">
            {/* Name + role */}
            <motion.div
              className="relative z-10"
              initial={{ x: -60, opacity: 0 }}
              animate={walkleyInView ? { x: 0, opacity: 1 } : { x: -60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 35, delay: 0.1 }}
            >
              <div className="flex items-center gap-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="Thomas Walkley on LinkedIn"
                >
                  <h1 className="text-3xl font-bold text-[#1a1a1a] underline decoration-transparent transition-colors group-hover:decoration-[#1a1a1a] md:text-4xl">
                    Thomas Walkley
                  </h1>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[#0A66C2] transition-opacity hover:opacity-80"
                  aria-label="Thomas Walkley on LinkedIn"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
              <h1 className="mt-2 text-2xl font-bold text-[#555] md:text-3xl">
                CEO @ Erin Living
              </h1>
            </motion.div>

            {/* Character illustration + chat balloon */}
            <motion.div
              className="relative shrink-0 md:-ml-4"
              initial={{ x: 60, opacity: 0 }}
              animate={walkleyInView ? { x: 0, opacity: 1 } : { x: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 35, delay: 0.25 }}
            >
              <Image
                src="/illustrations/team-male.png"
                alt="Thomas Walkley"
                width={400}
                height={400}
                className="h-[280px] w-[280px] object-contain drop-shadow-xl lg:h-[320px] lg:w-[320px]"
              />
              {/* Chat balloon (reversed) */}
              <motion.div
                className="absolute -top-20 right-[55%] w-[520px] lg:w-[600px]"
                initial={{ scale: 0, opacity: 0 }}
                animate={walkleyInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.4 }}
              >
                <div className="relative">
                  <Image
                    src="/illustrations/chat-baloon-empty.png"
                    alt=""
                    aria-hidden="true"
                    width={400}
                    height={267}
                    className="w-full drop-shadow-md"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  <div className="absolute inset-0 flex items-center px-[22%] pb-[20%] pt-[8%]">
                    <p className="text-center text-[15px] font-bold leading-relaxed text-white lg:text-[16px]">
                      &ldquo;We have been working with Upscalix from the first year of our startup, until now. They have been nothing short of a miracle to us, providing quality software development staff to propel us to our biggest capital raising round.&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile layout */}
          <div className="flex flex-col items-center gap-6 md:hidden">
            <motion.div
              className="w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={walkleyInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
            >
              <div className="relative">
                <Image
                  src="/illustrations/chat-baloon-empty.png"
                  alt=""
                  aria-hidden="true"
                  width={400}
                  height={267}
                  className="w-full drop-shadow-md"
                />
                <div className="absolute inset-0 flex items-center px-[22%] pb-[20%] pt-[8%]">
                  <p className="text-center text-[15px] font-bold leading-relaxed text-white">
                    &ldquo;We have been working with Upscalix from the first year of our startup, until now. They have been nothing short of a miracle to us, providing quality software development staff to propel us to our biggest capital raising round.&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={walkleyInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 35, delay: 0.4 }}
            >
              <Image
                src="/illustrations/developer-tr.png"
                alt="Thomas Walkley"
                width={120}
                height={120}
                className="h-14 w-14 rounded-full object-cover shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    aria-label="Thomas Walkley on LinkedIn"
                  >
                    <span className="text-xl font-bold text-[#1a1a1a] underline decoration-transparent transition-colors group-hover:decoration-[#1a1a1a]">
                      Thomas Walkley
                    </span>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[#0A66C2] transition-opacity hover:opacity-80"
                    aria-label="Thomas Walkley on LinkedIn"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
                <p className="text-sm font-medium text-[#555]">CEO @ Erin Living</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
