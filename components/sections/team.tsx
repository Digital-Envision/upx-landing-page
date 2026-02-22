import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const teamMembers = [
  {
    name: "Adi",
    role: "Technical Lead / PM",
    bio: "Seasoned technology leader with 15+ years of experience building and scaling engineering teams, architecting complex systems, and delivering innovative products across multiple domains.",
    avatar: "/illustrations/team-male.png",
    accent: "bg-primary/10",
  },
  {
    name: "Putri",
    role: "Senior Fullstack Engineer",
    bio: "Senior fullstack developer with 10+ years of experience building scalable systems end-to-end, skilled in Node.js, React, TypeScript, PostgreSQL, and AWS infrastructure.",
    avatar: "/illustrations/team-female.png",
    accent: "bg-accent/10",
  },
  {
    name: "Rizky",
    role: "Senior Frontend Engineer",
    bio: "Frontend developer with 10+ years' experience in JavaScript, TypeScript, React, Next.js, and Vue — passionate about solving complex UI problems and delivering pixel-perfect interfaces.",
    avatar: "/illustrations/team-male.png",
    accent: "bg-primary-light/10",
  },
  {
    name: "Sari",
    role: "Senior Backend Engineer",
    bio: "Senior backend engineer with 10+ years' experience specialising in backend development, proficient in Node.js, Python, Java, and databases, with strong skills in system design and QA.",
    avatar: "/illustrations/team-female.png",
    accent: "bg-accent-dark/10",
  },
];

export function TeamSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-16 text-center">
            <Badge variant="primary" className="mb-4">
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-[#333] sm:text-4xl md:text-5xl">
              What one of our elite teams look like
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Every member is a senior engineer with 10+ years&apos; experience
            </p>
          </div>
        </AnimateOnScroll>

        {/* Team grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <AnimateOnScroll key={member.name} delay={0.3 + index * 0.1}>
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                {/* Avatar */}
                <div className="mb-5 flex justify-center">
                  <div className="h-24 w-24 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105">
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
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[#333]">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Decorative accent */}
                <div
                  className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full ${member.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
