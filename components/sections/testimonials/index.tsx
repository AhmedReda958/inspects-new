import { SectionTitle } from "@/components/ui/section-title";
import TestimonialsSlider from "./slider";
import content from "@/content";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full py-20 md:py-32 bg-[#FAFBFD]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-12 md:gap-16">
          <SectionTitle>{content.testimonials.title}</SectionTitle>
          <TestimonialsSlider />
        </div>
      </div>
    </section>
  );
}
