"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const faqs = [
  {
    question: "How quickly can a team start?",
    answer:
      "Most teams are ready to kick off within 1-2 weeks. We match your requirements with pre-vetted senior engineers who have already worked together, so there's no lengthy recruitment or onboarding process.",
  },
  {
    question: "What's the minimum engagement period?",
    answer:
      "We recommend a minimum of 3 months to see meaningful results, but there are no long-term lock-in contracts. You can scale up, scale down, or pause at any time with 30 days' notice.",
  },
  {
    question: "How do you ensure code quality?",
    answer:
      "Every team follows strict engineering practices: code reviews on every PR, automated testing (unit, integration, E2E), CI/CD pipelines, and thorough documentation. Our Technical Leads ensure architectural consistency and best practices across all projects.",
  },
  {
    question: "What timezone do your teams work in?",
    answer:
      "Our teams are based in Indonesia (WIB/WITA), which provides a 4-hour overlap with AEST. Teams adjust their schedules to maximise overlap with your core working hours, and daily standups ensure alignment.",
  },
  {
    question: "Can I interview the team members?",
    answer:
      "Absolutely. We encourage you to meet the team before kicking off. You'll have the opportunity to review CVs, conduct technical interviews, and ensure the team is the right fit for your project.",
  },
  {
    question: "How is communication handled?",
    answer:
      "We integrate directly into your existing workflow — Slack, Microsoft Teams, Jira, Linear, or whatever tools you use. Daily standups, weekly demos, and a dedicated Technical Lead ensure transparent, proactive communication.",
  },
  {
    question: "What if a team member isn't the right fit?",
    answer:
      "We handle all HR and performance management. If someone isn't meeting expectations, we'll replace them quickly — typically within 1-2 weeks — at no additional cost to you.",
  },
  {
    question: "Do you handle DevOps and infrastructure?",
    answer:
      "Yes. Our teams are fullstack in the truest sense — they can set up and manage CI/CD pipelines, cloud infrastructure (AWS, GCP, Azure), containerisation (Docker, Kubernetes), monitoring, and more.",
  },
  {
    question: "How do you protect our intellectual property?",
    answer:
      "All team members sign comprehensive NDAs and IP assignment agreements before starting. Your code, data, and intellectual property are fully yours. We can also work within your VPN and security requirements.",
  },
  {
    question: "What technologies do your teams specialise in?",
    answer:
      "Our teams have deep expertise across the modern stack: React, Next.js, Vue, Node.js, Python, Java, Go, PostgreSQL, MongoDB, AWS, GCP, Docker, Kubernetes, and more. We match the right expertise to your tech stack.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-16 text-center">
            <Badge variant="primary" className="mb-4">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-[#333] sm:text-4xl md:text-5xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Everything you need to know about working with Upscalix.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Accordion */}
        <AnimateOnScroll>
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="py-6">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-start justify-between text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-8 text-base font-semibold text-[#333]">
                      {faq.question}
                    </span>
                    <span className="ml-auto shrink-0">
                      <svg
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-4 text-sm leading-relaxed text-gray-500">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
