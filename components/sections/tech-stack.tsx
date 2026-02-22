"use client";

import { type ReactNode } from "react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiAmazonwebservices,
  SiDocker,
  SiKubernetes,
  SiGraphql,
  SiRedis,
  SiMongodb,
  SiTailwindcss,
  SiVuedotjs,
  SiAngular,
  SiFlutter,
  SiJira,
  SiFigma,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { SiGo } from "react-icons/si";

interface TechItem {
  name: string;
  icon: ReactNode;
}

const row1: TechItem[] = [
  { name: "React", icon: <SiReact className="h-8 w-8 text-[#61DAFB]" /> },
  { name: "Next.js", icon: <SiNextdotjs className="h-8 w-8 text-[#000]" /> },
  { name: "TypeScript", icon: <SiTypescript className="h-8 w-8 text-[#3178C6]" /> },
  { name: "Node.js", icon: <SiNodedotjs className="h-8 w-8 text-[#339933]" /> },
  { name: "Python", icon: <SiPython className="h-8 w-8 text-[#3776AB]" /> },
  { name: "PostgreSQL", icon: <SiPostgresql className="h-8 w-8 text-[#4169E1]" /> },
  { name: "AWS", icon: <SiAmazonwebservices className="h-8 w-8 text-[#FF9900]" /> },
  { name: "Docker", icon: <SiDocker className="h-8 w-8 text-[#2496ED]" /> },
  { name: "Kubernetes", icon: <SiKubernetes className="h-8 w-8 text-[#326CE5]" /> },
  { name: "GraphQL", icon: <SiGraphql className="h-8 w-8 text-[#E10098]" /> },
];

const row2: TechItem[] = [
  { name: "Redis", icon: <SiRedis className="h-8 w-8 text-[#DC382D]" /> },
  { name: "MongoDB", icon: <SiMongodb className="h-8 w-8 text-[#47A248]" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="h-8 w-8 text-[#06B6D4]" /> },
  { name: "Vue.js", icon: <SiVuedotjs className="h-8 w-8 text-[#4FC08D]" /> },
  { name: "Java", icon: <FaJava className="h-8 w-8 text-[#ED8B00]" /> },
  { name: "Go", icon: <SiGo className="h-8 w-8 text-[#00ADD8]" /> },
  { name: "Angular", icon: <SiAngular className="h-8 w-8 text-[#DD0031]" /> },
  { name: "Flutter", icon: <SiFlutter className="h-8 w-8 text-[#02569B]" /> },
  { name: "Jira", icon: <SiJira className="h-8 w-8 text-[#0052CC]" /> },
  { name: "Figma", icon: <SiFigma className="h-8 w-8 text-[#F24E1E]" /> },
];

function TechIcon({ name, icon }: TechItem) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-2 rounded-2xl bg-[#F5F5F5] p-4 shadow-sm transition-shadow hover:shadow-md"
      style={{ width: 100, height: 100 }}
    >
      {icon}
      <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export function TechStackSection() {
  const row1Doubled = [...row1, ...row1];
  const row2Doubled = [...row2, ...row2];

  return (
    <section className="overflow-hidden bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#333] sm:text-3xl">
              Technologies our teams work with
            </h2>
            <p className="mt-3 text-gray-500">
              Expertise across the modern tech stack
            </p>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Row 1 — left to right */}
      <div
        className="relative mb-5"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex animate-marquee gap-5">
          {row1Doubled.map((tech, i) => (
            <TechIcon key={`r1-${i}`} {...tech} />
          ))}
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div
        className="relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex animate-marquee-reverse gap-5">
          {row2Doubled.map((tech, i) => (
            <TechIcon key={`r2-${i}`} {...tech} />
          ))}
        </div>
      </div>
    </section>
  );
}
