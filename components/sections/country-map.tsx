import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export function CountryMapSection() {
  return (
    <section className="bg-[#F8FAFC] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Text content */}
          <AnimateOnScroll className="flex-1 text-center lg:text-left">
            <Badge variant="accent" className="mb-4">
              Indonesian Talent
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-[#333] sm:text-4xl md:text-5xl">
              The top 1% of Indonesia&apos;s{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                engineering talent
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-500">
              We recruit Indonesia&apos;s top 1% of engineers — smart,
              hardworking, and rigorously trained to operate as a cohesive unit
              that delivers at lightning speed and quality.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-primary">10+</p>
                <p className="mt-1 text-sm text-gray-500">
                  Years avg. experience
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">50+</p>
                <p className="mt-1 text-sm text-gray-500">Projects delivered</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">98%</p>
                <p className="mt-1 text-sm text-gray-500">Client retention</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">4h</p>
                <p className="mt-1 text-sm text-gray-500">
                  Timezone overlap (AEST)
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Map illustration */}
          <AnimateOnScroll className="flex-1">
            <Image
              src="/illustrations/indonesia-map.png"
              alt="Map of Indonesia with developer avatars across the archipelago"
              width={800}
              height={800}
              className="mx-auto max-w-lg drop-shadow-lg"
            />
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
