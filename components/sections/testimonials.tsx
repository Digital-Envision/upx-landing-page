"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { FeaturedTestimonial } from "@/components/sections/featured-testimonial";

function SpeechBubble({
  children,
  tailPosition = "left",
}: {
  children: React.ReactNode;
  tailPosition?: "left" | "right" | "center";
}) {
  return (
    <div className="group/bubble relative">
      <div
        className="relative overflow-hidden rounded-3xl px-8 py-7 transition-all duration-300 group-hover/bubble:scale-[1.015] sm:px-10 sm:py-8 lg:px-12 lg:py-10"
        style={{
          background:
            "linear-gradient(145deg, #5B9CF5 0%, #3366F5 40%, #2248F3 100%)",
          boxShadow:
            "0 12px 40px rgba(34, 72, 243, 0.25), 0 4px 12px rgba(34, 72, 243, 0.1)",
        }}
      >
        <span
          className="pointer-events-none absolute -top-4 left-4 select-none font-serif text-8xl font-black leading-none text-white/20 sm:-top-2 sm:left-6 lg:left-8 lg:text-9xl"
          aria-hidden="true"
        >
          &ldquo;
        </span>
        {children}
      </div>
      <svg
        className={`absolute -bottom-[15px] h-[16px] w-[24px] text-[#2248F3] ${tailPosition === "left"
          ? "left-10 md:left-12 -scale-x-100"
          : tailPosition === "right"
            ? "right-10 md:right-12"
            : "left-1/2 -translate-x-1/2 -scale-x-100"
          }`}
        viewBox="0 0 24 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0H24V16C12 16 0 8 0 0Z" />
      </svg>
    </div>
  );
}

function LinkedInLink({
  href,
  name,
  children,
}: {
  href: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group"
        aria-label={`${name} on LinkedIn`}
      >
        {children}
      </a>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-[#0A66C2] transition-opacity hover:opacity-80"
        aria-label={`${name} on LinkedIn`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 lg:h-6 lg:w-6">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
    </div>
  );
}

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
          {/* Desktop — bubble + name left, character right */}
          <div className="hidden md:flex mx-auto max-w-5xl items-end">
            {/* Bubble + attribution */}
            <div className="relative z-20 flex min-w-0 flex-col gap-6 pb-4 sm:gap-8">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={walkleyInView ? { scale: 1, opacity: 1 } : { scale: 0.92, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.35 }}
              >
                <motion.div
                  animate={walkleyInView ? { y: [0, -6, 0] } : {}}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                >
                  <SpeechBubble tailPosition="right">
                    <p className="relative text-xl font-light italic leading-[1.7] text-white sm:text-xl" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.15)" }}>
                      &ldquo;We have been working with Upscalix from the first year of our startup, until now. They have been nothing short of a miracle to us, providing quality software development staff to propel us to our biggest capital raising round.&rdquo;
                    </p>
                  </SpeechBubble>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex flex-col items-end"
                initial={{ y: 20, opacity: 0 }}
                animate={walkleyInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 35, delay: 0.5 }}
              >
                <LinkedInLink
                  href="https://linkedin.com"
                  name="Thomas Walkley"
                >
                  <h3 className="text-2xl font-bold text-[#1a1a1a] underline decoration-transparent transition-colors group-hover:decoration-[#1a1a1a] lg:text-3xl">
                    Thomas Walkley
                  </h3>
                </LinkedInLink>
                <p className="mt-1 text-lg text-[#555] lg:text-xl">
                  CEO @ Erin Living
                </p>
              </motion.div>
            </div>

            {/* Character — entrance + idle float */}
            <motion.div
              className="relative z-10 shrink-0 -ml-6 lg:-ml-10"
              initial={{ x: 60, opacity: 0 }}
              animate={walkleyInView ? { x: 0, opacity: 1 } : { x: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 35, delay: 0.1 }}
            >
              <Image
                src="/illustrations/client-2.webp"
                alt="Thomas Walkley"
                width={500}
                height={600}
                className="h-90 w-auto object-contain lg:h-105"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-linear-to-b from-transparent to-white" />
            </motion.div>
          </div>

          {/* Mobile */}
          <div className="flex flex-col items-center gap-5 md:hidden">
            <motion.div
              className="w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={walkleyInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
            >
              <SpeechBubble tailPosition="center">
                <p className="relative text-lg font-light italic leading-[1.7] text-white sm:text-xl" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.15)" }}>
                  &ldquo;We have been working with Upscalix from the first year of our startup, until now. They have been nothing short of a miracle to us, providing quality software development staff to propel us to our biggest capital raising round.&rdquo;
                </p>
              </SpeechBubble>
            </motion.div>

            <motion.div
              className="flex items-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={walkleyInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 35, delay: 0.4 }}
            >
              <Image
                src="/illustrations/client-2-avatar.webp"
                alt="Thomas Walkley"
                width={120}
                height={120}
                className="h-16 w-16 rounded-full object-cover shadow-lg"
              />
              <div>
                <LinkedInLink
                  href="https://linkedin.com"
                  name="Thomas Walkley"
                >
                  <span className="text-lg font-bold text-[#1a1a1a] underline decoration-transparent transition-colors group-hover:decoration-[#1a1a1a]">
                    Thomas Walkley
                  </span>
                </LinkedInLink>
                <p className="text-sm font-medium text-[#555]">CEO @ Erin Living</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
