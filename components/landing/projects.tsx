import Image from "next/image";
import type { ProjectsContent } from "@/lib/landing/content";
import { Eyebrow, LearnMoreButton, LpContainer } from "./ui";

/**
 * The row of client work. The frames use it two ways: pages 1 and 3 drop it
 * straight under the featured case study with no heading, and page 4 — which
 * has no case study — gives it a full section header of its own. Hence the
 * cards live here on their own, and `ProjectsSection` only adds the chrome.
 */
export function ProjectCards({ items }: { items: ProjectsContent["items"] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((project) => (
        <li
          key={project.name}
          className="flex flex-col overflow-hidden rounded-lg border border-lp-line bg-white"
        >
          {/*
            The mockups are inset on a tinted panel rather than bled to the card
            edge, so the device silhouette reads as artwork. The inset is in px,
            not the frame's percentages: CSS resolves percentage padding against
            the *width* in both axes, which would shrink the artwork inside a
            fixed-height panel every time the card got narrower.
          */}
          <div className="flex h-[240px] w-full items-center justify-center bg-lp-mist px-8 py-5">
            <Image
              src={project.image}
              alt=""
              width={800}
              height={557}
              loading="lazy"
              sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex flex-1 flex-col items-start p-4">
            <h3 className="pb-2.5 text-[25px] font-bold leading-[31px] text-lp-navy">
              {project.name}
            </h3>
            <p className="flex-1 pb-5 text-[16px] font-medium leading-[26px] text-lp-slate">
              {project.blurb}
            </p>
            <LearnMoreButton href={project.href} label={project.name} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Page 4's standalone, headed version of the row. */
export function ProjectsSection({ content }: { content: ProjectsContent }) {
  return (
    <section id="case-study" className="bg-white pb-14 pt-16 md:pb-[56px] md:pt-[80px]">
      <LpContainer>
        <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          {content.eyebrow ? <Eyebrow className="mb-4">{content.eyebrow}</Eyebrow> : null}
          {content.heading ? (
            <h2 className="text-[clamp(1.75rem,4.2vw,2.5rem)] font-bold leading-[1.2] text-balance text-lp-navy">
              {content.heading}
            </h2>
          ) : null}
          {content.body ? (
            <p className="mt-4 text-[17px] font-medium leading-[30px] text-lp-slate sm:text-[18px]">
              {content.body}
            </p>
          ) : null}
        </div>

        <div className="mt-[46px]">
          <ProjectCards items={content.items} />
        </div>
      </LpContainer>
    </section>
  );
}
