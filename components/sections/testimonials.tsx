import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { FeaturedTestimonial } from "@/components/sections/featured-testimonial";

export function TestimonialsSection() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-16 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
              Why our clients love working with us
            </h1>
          </div>
        </AnimateOnScroll>

        {/* Featured testimonial */}
        <FeaturedTestimonial />
      </div>
    </section>
  );
}
