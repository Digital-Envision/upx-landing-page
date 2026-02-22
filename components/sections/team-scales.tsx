"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

export function TeamScalesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-white py-[120px]">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-[#333] sm:text-4xl md:text-5xl">
            A team that scales with you
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
            A senior team designed around your needs — frontend, backend,
            DevOps, QA, and PMs you can scale, swap, or reshape as your roadmap
            grows.
          </p>
        </motion.div>

        <motion.div
          className="mt-14 flex justify-center"
          initial={{ y: 60, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 35,
            delay: 0.3,
          }}
        >
          <Image
            src="/illustrations/hero-team.png"
            alt="A team of senior developers working together"
            width={600}
            height={600}
            className="h-auto w-[320px] object-contain drop-shadow-xl sm:w-[400px] md:w-[500px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
