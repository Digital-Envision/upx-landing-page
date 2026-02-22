import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { FeaturedTestimonial } from "@/components/sections/featured-testimonial";

const testimonials = [
  {
    quote:
      "Upscalix gave us a senior engineering team that felt like an extension of our own. They shipped features faster than our local hires ever did.",
    name: "James Mitchell",
    role: "CTO",
    company: "FinTrack",
    rating: 5,
    avatarPosition: "object-[0%_0%]" as const,
  },
  {
    quote:
      "The quality of engineers is outstanding. They understand complex architecture, write clean code, and communicate proactively. Worth every cent.",
    name: "Sarah Chen",
    role: "VP of Engineering",
    company: "EduPlatform",
    rating: 5,
    avatarPosition: "object-[100%_0%]" as const,
  },
  {
    quote:
      "We went from idea to launched product in under 4 months. The team was cohesive from day one — no ramp-up time, no hand-holding needed.",
    name: "David Park",
    role: "Founder & CEO",
    company: "ShopLocal",
    rating: 5,
    avatarPosition: "object-[0%_100%]" as const,
  },
  {
    quote:
      "I was skeptical about offshore teams, but Upscalix changed my mind completely. The timezone overlap with Australia makes it seamless.",
    name: "Emma Thompson",
    role: "Product Director",
    company: "CloudSync",
    rating: 5,
    avatarPosition: "object-[100%_100%]" as const,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-gray-200"}`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="bg-[#FAFAFA] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-16 text-center">
            <Badge variant="primary" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-[#333] sm:text-4xl md:text-5xl">
              Loved by founders and CTOs
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Don&apos;t just take our word for it — hear from the companies
              we&apos;ve helped scale.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Featured testimonial */}
        <FeaturedTestimonial />

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <AnimateOnScroll key={testimonial.name} delay={0.3 + index * 0.1}>
              <div className="group relative rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                {/* Quote icon */}
                <svg
                  className="mb-4 h-8 w-8 text-primary/20"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                </svg>

                <StarRating rating={testimonial.rating} />

                <p className="mt-4 text-[#333] leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/illustrations/testimonial-avatars.png"
                      alt={testimonial.name}
                      width={200}
                      height={200}
                      className={`h-[200%] w-[200%] max-w-none ${testimonial.avatarPosition}`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[#333]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute -bottom-3 -right-3 h-16 w-16 rounded-full bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
