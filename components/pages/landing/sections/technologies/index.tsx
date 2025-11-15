import { SectionTitle } from "@/components/ui/section-title";
import TechnologiesSlider from "./slider";
import content from "@/content";

export default function TechnologiesSection() {
  return (
    <section id="technologies" className="w-full py-20 md:py-32 bg-white">
      <div className="container flex flex-col items-center gap-12 md:gap-16">
        <SectionTitle>{content.technologies.title}</SectionTitle>
        <TechnologiesSlider />
      </div>
    </section>
  );
}
