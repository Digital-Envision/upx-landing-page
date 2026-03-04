"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   Avatar configuration

   Individual avatar images (developer-tl/tr/bl/br.png) are
   used for each developer portrait.

   Avatars:  TL = male + glasses
             TR = female + hijab
             BL = female + glasses
             BR = male dark-skin

   Each avatar starts at a location ON the Indonesia map
   (representing where they're from) and animates outward
   to its final floating position around the edges.
   ────────────────────────────────────────────────────────── */

type AvatarId = "tl" | "tr" | "bl" | "br";

const avatarSrc: Record<AvatarId, string> = {
  tl: "/illustrations/developer-tl.png",
  tr: "/illustrations/developer-tr.png",
  bl: "/illustrations/developer-bl.png",
  br: "/illustrations/developer-br.png",
};

interface AvatarConfig {
  avatar: AvatarId;
  /** Scroll progress (0–1) at which this avatar starts appearing */
  startAt: number;
  /** Starting position (% of container) — a location on the map */
  startTop: number;
  startLeft: number;
  /** Final position (% of container) — floating around the edges */
  endTop: number;
  endLeft: number;
  /** Tailwind size tier */
  size: "sm" | "md" | "lg";
}

/** Each avatar animates over this fraction of scroll progress */
const ANIM_RANGE = 0.12;

const avatars: AvatarConfig[] = [
  // From Sumatra → top-left edge
  { avatar: "tl", startAt: 0.08, startTop: 45, startLeft: 24, endTop: 4, endLeft: 4, size: "lg" },
  // From Kalimantan → top-right edge
  { avatar: "tr", startAt: 0.20, startTop: 32, startLeft: 52, endTop: 0, endLeft: 85, size: "md" },
  // From Java → middle-left edge
  { avatar: "bl", startAt: 0.32, startTop: 56, startLeft: 36, endTop: 50, endLeft: -1, size: "md" },
  // From Sulawesi → middle-right edge
  { avatar: "br", startAt: 0.44, startTop: 38, startLeft: 60, endTop: 44, endLeft: 89, size: "lg" },
  // From Bali/NTT → bottom-left edge
  { avatar: "tr", startAt: 0.56, startTop: 58, startLeft: 46, endTop: 82, endLeft: 8, size: "sm" },
  // From Maluku/Papua → bottom-right edge
  { avatar: "tl", startAt: 0.68, startTop: 42, startLeft: 70, endTop: 85, endLeft: 87, size: "md" },
];

const sizeClasses: Record<AvatarConfig["size"], string> = {
  sm: "w-12 h-12 md:w-[68px] md:h-[68px]",
  md: "w-14 h-14 md:w-[84px] md:h-[84px]",
  lg: "w-16 h-16 md:w-[100px] md:h-[100px]",
};

/* ── Individual floating avatar ────────────────────────── */

function FloatingAvatar({
  config,
  scrollProgress,
}: {
  config: AvatarConfig;
  scrollProgress: MotionValue<number>;
}) {
  const end = config.startAt + ANIM_RANGE;

  const opacity = useTransform(scrollProgress, [config.startAt, end], [0.1, 1]);
  const scale = useTransform(scrollProgress, [config.startAt, end], [0.3, 1]);

  // Interpolate position from map location → final edge position
  const topNum = useTransform(
    scrollProgress,
    [config.startAt, end],
    [config.startTop, config.endTop],
  );
  const leftNum = useTransform(
    scrollProgress,
    [config.startAt, end],
    [config.startLeft, config.endLeft],
  );

  // Convert numeric values to CSS percentage strings
  const top = useTransform(topNum, (v) => `${v}%`);
  const left = useTransform(leftNum, (v) => `${v}%`);

  return (
    <motion.div
      className={`absolute z-10 ${sizeClasses[config.size]} rounded-full overflow-hidden shadow-lg shadow-blue-500/25`}
      style={{ top, left, opacity, scale }}
    >
      <Image
        src={avatarSrc[config.avatar]}
        alt="Developer"
        width={420}
        height={420}
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}

/* ── Section ───────────────────────────────────────────── */

export function CountryMapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  /* The section is 400vh tall so the sticky content stays pinned
     for ~3 full viewport-heights of scrolling. useScroll tracks
     progress across the entire pinned range. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-clip bg-white"
      style={{ height: "280vh" }}
    >
      {/* Sticky container — stays pinned for the entire scroll range */}
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-visible">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          {/* ── Heading ────────────────────────────────── */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl md:text-6xl lg:text-[4rem]">
              The top 1% of Indonesia&apos;s engineering talent
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#555]">
              We recruit Indonesia&apos;s top 1% of engineers — smart,
              hardworking, and rigorously trained to operate as a cohesive unit
              that delivers at lightning speed and quality
            </p>
          </motion.div>

          {/* ── Map + floating avatars composition ─────── */}
          <div
            className="relative mx-auto mt-10 max-w-4xl"
            style={{ aspectRatio: "16 / 10" }}
          >
            {/* Indonesia map (center) — always visible */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/illustrations/indonesia-map.png"
                alt="Map of Indonesia showing developer locations across the archipelago"
                width={900}
                height={600}
                className="w-[80%] drop-shadow-lg"
              />
            </div>

            {/* Floating developer avatars — emerge from map locations */}
            {avatars.map((avatar, i) => (
              <FloatingAvatar
                key={i}
                config={avatar}
                scrollProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
