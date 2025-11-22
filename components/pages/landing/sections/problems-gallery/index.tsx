import * as React from "react";

import content from "@/content";
import { SectionTitle } from "@/components/ui/section-title";
import { AnimatedButton } from "@/components/ui/animated-button";

import ProblemsGallerySlider from "./slider";

export default function ProblemsGallerySection() {
  return (
    <section id="problems-gallery" className="bg-[#FAFBFD] py-20 lg:py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <SectionTitle
          className="text-primary text-2xl lg:text-4xl"
          variant="center"
          showLogo={false}
        >
          {content.problemsGallery.title}
          <br />
          <span className="text-lg font-bold text-primary-light -mt-2">
            {content.problemsGallery.subtitle}
          </span>
        </SectionTitle>

        {/* Carousel */}
        <ProblemsGallerySlider />

        {/* Call to Action */}
        <div className="flex flex-col items-center gap-8 mt-10 md:mt-16">
          <h3 className="text-2xl lg:text-3xl font-bold text-primary leading-[1.5]">
            {content.problemsGallery.callToAction.text}
            <span className="text-secondary">
              {content.problemsGallery.callToAction.companyName}
            </span>
          </h3>
          <AnimatedButton variant="primary" size="default" href="#calculator">
            {content.problemsGallery.callToAction.buttonText}
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}
