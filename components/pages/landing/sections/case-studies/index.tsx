"use client";

import { SectionTitle } from "@/components/ui/section-title";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import content from "@/content";
import { useState, useRef, useEffect } from "react";
import { CaseStudyCard } from "./case-study-card";
import { CaseStudyNavigation } from "./case-study-navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export function CaseStudies() {
  const { caseStudies } = content;
  const [api, setApi] = useState<CarouselApi>();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      // Scroll to the beginning of the content when carousel changes (mobile only)
      if (contentRef.current) {
        contentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    api.on("select", onSelect);

    // Cleanup function
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="py-16 bg-white" id="case-studies">
      <div className="container">
        <SectionTitle variant="center">{caseStudies.title}</SectionTitle>

        <div ref={contentRef} className="w-full max-w-6xl mx-auto mt-12">
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
