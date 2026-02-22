"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

type AnimationVariant = "default" | "hero" | "steps";

interface AnimateOnScrollProps {
  children: ReactNode;
  variant?: AnimationVariant;
  className?: string;
  delay?: number;
}

const variants = {
  default: {
    initial: { y: 96, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      mass: 1,
      delay: 0.3,
    },
  },
  hero: {
    initial: { y: 120, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 60,
      mass: 2,
      delay: 1,
    },
  },
  steps: {
    initial: { y: 96, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      mass: 1,
      delay: 0.6,
    },
  },
};

export function AnimateOnScroll({
  children,
  variant = "default",
  className,
  delay,
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const config = variants[variant];
  const transition = delay !== undefined
    ? { ...config.transition, delay }
    : config.transition;

  return (
    <motion.div
      ref={ref}
      initial={config.initial}
      animate={isInView ? config.animate : config.initial}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
