"use client";

import { SectionTitle } from "@/components/ui/section-title";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import content from "@/content";
import { useState } from "react";
import { CaseStudyCard } from "./case-study-card";
import { CaseStudyNavigation } from "./case-study-navigation";

export function CaseStudies() {
  const { caseStudies } = content;

  const [currentCaseStudy, setCurrentCaseStudy] = useState(0);

  return (
    <section className="py-16 bg-white" id="case-studies">
      <div className="container">
        <SectionTitle variant="center">{caseStudies.title}</SectionTitle>

        <Carousel
          className="w-full max-w-6xl mx-auto mt-12"
          dir="ltr"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {caseStudies.items.map((caseStudy) => (
              <CarouselItem key={caseStudy.id}>
                <CaseStudyCard caseStudy={caseStudy} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CaseStudyNavigation
            currentIndex={currentCaseStudy}
            totalItems={caseStudies.items.length}
            onPrevious={() => setCurrentCaseStudy(currentCaseStudy - 1)}
            onNext={() => setCurrentCaseStudy(currentCaseStudy + 1)}
            onDotClick={(index) => setCurrentCaseStudy(index)}
          />
        </Carousel>
      </div>
    </section>
  );
}
