"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

const coreOffer = [
  {
    title: "3× Senior Engineers",
    description: "Frontend, backend, or fullstack — matched to your stack and scoped to your roadmap.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "Tech Lead / PM included",
    description: "Delivery ownership, stakeholder comms, sprint planning — all handled without adding to your management load.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    title: "QA included",
    description: "Test planning, regression suites, and release confidence built into every sprint — not bolted on at the end.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

const deliverySystem = [
  {
    title: "Weekly planning + daily async updates",
    description: "Sprint kickoffs, daily Slack standups, and end-of-week summaries — full visibility without micromanagement.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "PR-first workflow + code reviews",
    description: "Every change goes through peer review. Your standards, your conventions, enforced consistently.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "QA gates before every release",
    description: "No feature ships without QA sign-off. Test plans, regression checks, and a clear definition of done.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
  },
  {
    title: "Transparent velocity reporting",
    description: "Cycle time, throughput, blockers — reported weekly so you always know where your roadmap stands.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

const bonuses = [
  {
    title: "\"First 10 Days\" Onboarding Blueprint",
    description: "Plug-and-play PDF + checklist: access, repos, environments, coding standards, PR workflow, QA gates.",
  },
  {
    title: "Delivery Health Check (90 mins)",
    description: "Quick audit of bottlenecks — CI time, PR review latency, environment pain — plus top 5 fixes, in writing.",
  },
  {
    title: "Architecture & Tech Debt Triage Workshop",
    description: "2-hour session to map top risk areas + produce a ranked tech-debt backlog with impact vs effort scores.",
  },
  {
    title: "Security & SDLC Baseline Checklist",
    description: "Secrets handling, IAM basics, branch protections, logging/PII, vuln scanning — CTO-friendly one-pager.",
  },
  {
    title: "\"Cost vs Local Hiring\" Calculator",
    description: "Transparent comparison: salary, super, recruitment time, contractor churn, and true loaded cost.",
  },
  {
    title: "Engineering Hiring Scorecard + Interview Kit",
    description: "Rubrics, sample questions, and take-home standards to help your own hiring process too.",
  },
  {
    title: "CI/CD Quick Wins Pack",
    description: "Caching patterns, parallelisation ideas, flaky test triage, and a PR checks baseline to ship faster.",
  },
  {
    title: "Observability Starter Pack",
    description: "Suggested SLOs, error budget basics, and \"what to instrument first\" (Sentry/Datadog/New Relic ready).",
  },
  {
    title: "Release Readiness Template",
    description: "A one-pager Definition of Done + QA gates your whole Eng/Product org can align on.",
  },
  {
    title: "Knowledge Retention System Setup",
    description: "Notion/Confluence structure + tribal knowledge capture rituals: ADR template, runbooks, onboarding notes.",
  },
];

function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -4;
    const rotateY = ((x - cx) / cx) * 4;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

export function BenefitsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="services" className="bg-white py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ y: 24, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl">
            What you get
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#555]">
            The complete offer — core team, delivery system, and everything you need to ship from week one.
          </p>
        </motion.div>

        {/* Core Offer */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[#2248F3]">Core Pod</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {coreOffer.map((item, i) => (
              <motion.div
                key={item.title}
                className="h-full"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.08 }}
              >
                <TiltCard className="h-full">
                  <div className="animated-border-card group h-full p-8">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4ff] text-[#2248F3] transition-colors group-hover:bg-[#2248F3] group-hover:text-white">
                      {item.icon}
                    </div>
                    <h5 className="text-lg font-bold text-[#1a1a1a]">{item.title}</h5>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#555]">{item.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Delivery System */}
        <motion.div
          className="mt-16"
          initial={{ y: 16, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        >
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[#2248F3]">Delivery System</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {deliverySystem.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 + i * 0.08 }}
              >
                <TiltCard>
                  <div className="animated-border-card group p-8">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4ff] text-[#2248F3] transition-colors group-hover:bg-[#2248F3] group-hover:text-white">
                      {item.icon}
                    </div>
                    <h5 className="text-lg font-bold text-[#1a1a1a]">{item.title}</h5>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#555]">{item.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bonuses */}
        <motion.div
          className="mt-16"
          initial={{ y: 16, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
        >
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[#2248F3]">Included Bonuses</p>
          <div className="rounded-2xl border border-gray-100 bg-[#FAFBFF] p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {bonuses.map((bonus, i) => (
                <motion.div
                  key={bonus.title}
                  className="flex gap-3"
                  initial={{ x: -8, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : { x: -8, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 + i * 0.05 }}
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2248F3]">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{bonus.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-[#666]">{bonus.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
