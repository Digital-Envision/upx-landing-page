"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const teamMembers = [
  {
    name: "Adi",
    role: "Technical Lead / PM",
    bio: "Seasoned technology leader with 10+ years of experience building and scaling engineering teams, architecting complex systems, and delivering innovative products across multiple domains.",
    avatar: "/illustrations/team-male-1.webp",
  },
  {
    name: "Putri",
    role: "Senior Fullstack Engineer",
    bio: "Senior fullstack developer with 7+ years of experience building scalable systems end-to-end, skilled in Node.js, React, TypeScript, PostgreSQL, and AWS infrastructure.",
    avatar: "/illustrations/team-female.webp",
  },
  {
    name: "Rizky",
    role: "Senior Frontend Engineer",
    bio: "Frontend developer with 8+ years' experience in JavaScript, TypeScript, React, Next.js, and Vue — passionate about solving complex UI problems and delivering pixel-perfect interfaces.",
    avatar: "/illustrations/team-male-1.webp",
  },
  {
    name: "Sari",
    role: "Senior Backend Engineer",
    bio: "Senior backend engineer with 7+ years' experience specialising in backend development, proficient in Node.js, Python, Java, and databases, with strong skills in system design and QA.",
    avatar: "/illustrations/team-female.webp",
  },
];

export function TeamSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className="bg-[#FAFBFF] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-16 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
              What one of our elite teams look like
            </h1>
            <p className="mt-4 text-lg text-[#555]">
              Every member is a senior engineer with 7+ years&apos; experience
            </p>
          </div>
        </AnimateOnScroll>

        {/* Team grid */}
        <div ref={ref} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 60, opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: 0.1 + index * 0.1,
              }}
            >
              <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-center transition-all duration-300 hover:border-[#2248F3]/20 hover:shadow-lg hover:-translate-y-1">
                {/* Avatar */}
                <div className="mb-6 flex justify-center">
                  <div className="h-48 w-48 overflow-hidden rounded-2xl bg-[#F5F5F5] transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={member.avatar}
                      alt={`${member.name} - ${member.role}`}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <p className="text-xl font-bold text-[#1a1a1a]">
                  {member.name}
                </p>
                <p className="mt-1 text-sm font-medium text-[#2248F3]">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#555]">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
