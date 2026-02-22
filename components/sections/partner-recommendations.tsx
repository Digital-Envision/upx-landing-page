import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const recommendations = [
  {
    quote:
      "I've worked with dozens of development agencies, and Upscalix is in a league of their own. Their engineers are true seniors — they don't just write code, they architect solutions.",
    name: "Michael Torres",
    title: "Managing Partner",
    company: "Velocity Ventures",
    color: "bg-primary",
  },
  {
    quote:
      "Every portfolio company I've referred to Upscalix has come back with glowing reviews. They consistently deliver above expectations and within budget.",
    name: "Rachel Kim",
    title: "Investment Director",
    company: "Pacific Capital",
    color: "bg-accent",
  },
  {
    quote:
      "For startups that need to move fast without compromising quality, Upscalix is my #1 recommendation. The team-based model is a game changer.",
    name: "Andrew Walsh",
    title: "Startup Advisor",
    company: "TechBridge Consulting",
    color: "bg-primary-light",
  },
];

export function PartnerRecommendationsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-16 text-center">
            <Badge variant="primary" className="mb-4">
              Recommendations
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-[#333] sm:text-4xl md:text-5xl">
              Trusted by industry leaders
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Endorsed by investors, advisors, and technology leaders across
              Australia.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Recommendations grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {recommendations.map((rec, index) => (
            <AnimateOnScroll key={rec.name} delay={0.3 + index * 0.15}>
              <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                {/* Accent bar */}
                <div
                  className={`absolute left-0 top-8 h-12 w-1 rounded-r-full ${rec.color}`}
                />

                <p className="flex-1 text-[#333] leading-relaxed">
                  &ldquo;{rec.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-8 flex items-center gap-4 border-t border-gray-200 pt-6">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ${rec.color}`}
                  >
                    {rec.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-[#333]">{rec.name}</p>
                    <p className="text-sm text-gray-500">
                      {rec.title}, {rec.company}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
