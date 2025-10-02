"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import content from "@/content";
import { SectionTitle } from "@/components/ui/section-title";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import ProblemsGallerySlider from "./slider";
const problemImages = [
  {
    src: "/images/problems-gallery/problem-1.png",
    alt: "مشكلة هندسية 1",
  },
  {
    src: "/images/problems-gallery/problem-2.png",
    alt: "مشكلة هندسية 2",
  },
  {
    src: "/images/problems-gallery/problem-3.png",
    alt: "مشكلة هندسية 3",
  },
  {
    src: "/images/problems-gallery/problem-4.png",
    alt: "مشكلة هندسية 4",
  },
  {
    src: "/images/problems-gallery/problem-5.png",
    alt: "مشكلة هندسية 5",
  },
  {
    src: "/images/problems-gallery/problem-1.png",
    alt: "مشكلة هندسية 1",
  },
  {
    src: "/images/problems-gallery/problem-2.png",
    alt: "مشكلة هندسية 2",
  },
  {
    src: "/images/problems-gallery/problem-3.png",
    alt: "مشكلة هندسية 3",
  },
  {
    src: "/images/problems-gallery/problem-4.png",
    alt: "مشكلة هندسية 4",
  },
  {
    src: "/images/problems-gallery/problem-5.png",
    alt: "مشكلة هندسية 5",
  },
];

export default function ProblemsGallerySection() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

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
          <ProblemsGallerySlider setApi={setApi} />

          {/* Problem Name */}
          <p className="text-xl font-medium text-[#333333]">
            {content.problemsGallery.problemName}
          </p>

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

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 md:gap-8 pt-8">
            <button
              onClick={() => api?.scrollPrev()}
              className="w-12 h-12 md:w-14 md:h-14 bg-[#021A60] text-white rounded-full flex items-center justify-center hover:bg-[#021A60]/90 transition-all duration-200 shadow-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <div className="flex gap-1.5 md:gap-2 px-4">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-200 ${
                    index === current
                      ? "bg-[#F25B06] scale-110"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => api?.scrollNext()}
              className="w-12 h-12 md:w-14 md:h-14 bg-[#F25B06] text-white rounded-full flex items-center justify-center hover:bg-[#F25B06]/90 transition-all duration-200 shadow-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
