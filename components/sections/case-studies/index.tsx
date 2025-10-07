"use client";

import { SectionTitle } from "@/components/ui/section-title";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import content from "@/content";
import { useState } from "react";
import { CaseStudyCard } from "./case-study-card";
import { CaseStudyNavigation } from "./case-study-navigation";

export function CaseStudies() {
  const { caseStudies } = content;
  const [api, setApi] = useState<CarouselApi>();

  return (
    <section className="py-16 bg-white" id="case-studies">
      <div className="container">
        <SectionTitle variant="center">{caseStudies.title}</SectionTitle>

        <div className="w-full max-w-6xl mx-auto mt-12">
          <Carousel
            setApi={setApi}
            className="w-full"
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
          </Carousel>
          <CaseStudyNavigation
            api={api}
            totalItems={caseStudies.items.length}
          />
        </div>
      </div>
    </section>
  );
}
