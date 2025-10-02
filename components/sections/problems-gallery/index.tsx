import * as React from "react";

import content from "@/content";
import { SectionTitle } from "@/components/ui/section-title";

import ProblemsGallerySlider from "./slider";

export default function ProblemsGallerySection() {
  return (
    <section id="problems-gallery" className="bg-[#FAFBFD] py-20 lg:py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-8" dir="rtl">
          {/* Header */}
          <SectionTitle
            className="text-2xl lg:text-4xl max-w-2xl mx-auto leading-[1.76] text-[#021A60]"
            variant="center"
            showLogo={false}
          >
            {content.problemsGallery.title}
          </SectionTitle>

          {/* Carousel */}
          <ProblemsGallerySlider />

          {/* Call to Action */}
          <div className="space-y-6">
            <h3 className="text-2xl lg:text-3xl font-bold text-[#021A60] leading-[1.5]">
              {content.problemsGallery.callToAction.text}
            </h3>
            <button className="bg-[#021A60] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#021A60]/90 transition-colors border border-[#021A60] relative">
              {content.problemsGallery.callToAction.buttonText}
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#021A60] rounded-full transform translate-x-1 -translate-y-1"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
