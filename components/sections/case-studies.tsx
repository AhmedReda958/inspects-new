"use client";

import { SectionTitle } from "@/components/ui/section-title";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import content from "@/content";
import Image from "next/image";
import BrandBlueSquare from "@/icons/brand-blue-square.svg";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export function CaseStudies() {
  const { caseStudies } = content;

  const [currentCaseStudy, setCurrentCaseStudy] = useState(0);

  return (
    <section className="py-16 bg-white" id="case-studies">
      <div className="container">
        <SectionTitle variant="center">{caseStudies.title}</SectionTitle>

        <Carousel className="w-full max-w-6xl mx-auto mt-12" dir="ltr">
          <CarouselContent>
            {caseStudies.items.map((caseStudy) => (
              <CarouselItem key={caseStudy.id}>
                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="p-0" dir="rtl">
                    {/* Grid Layout - Content takes 2/3 on desktop, full width on mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Image Section - 1/3 on desktop, full width on mobile */}
                      <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh-100px)] overflow-hidden lg:order-last">
                        <Image
                          src={caseStudy.image}
                          alt="Case Study"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content Section - 2/3 on desktop, full width on mobile */}
                      <div className="lg:col-span-7 space-y-6">
                        {/* Property Details */}
                        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4  bg-background p-10 text-center *:space-y-2 *:pb-4 *:border-b *:lg:border-b-0  *:w-fit *:lg:text-start mb-10 ">
                          <div className="lg:border-l-1 lg:pl-4">
                            <h3 className="lg:text-base font-bold text-primary">
                              قيمة العقار
                            </h3>
                            <p className="lg:text-sm font-medium">
                              {caseStudy.propertyValue}
                            </p>
                          </div>
                          <div className="lg:border-l-1 lg:pl-4">
                            <h3 className="lg:text-base font-bold text-primary">
                              الموقع
                            </h3>
                            <p className="lg:text-sm">{caseStudy.location}</p>
                          </div>
                          <div>
                            <h3 className="lg:text-base font-bold text-primary">
                              المشكلة
                            </h3>
                            <p className="lg:text-sm">{caseStudy.problem}</p>
                          </div>
                        </div>

                        {/* Story Section */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <BrandBlueSquare />

                            <h3 className="text-primary">
                              {caseStudy.story.title}
                            </h3>
                          </div>
                          <p className="leading-loose">
                            {caseStudy.story.content}
                          </p>
                        </div>

                        {/* What We Provided Section */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <BrandBlueSquare />

                            <h3 className="text-primary">
                              {caseStudy.whatWeProvided.title}
                            </h3>
                          </div>
                          <ul className="space-y-2">
                            {caseStudy.whatWeProvided.items.map(
                              (item, index) => (
                                <li
                                  key={index}
                                  className="text-foreground text-base flex items-start gap-2 leading-loose"
                                >
                                  <span className=" mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        {/* Result Section */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <BrandBlueSquare />

                            <h3 className="text-primary">
                              {caseStudy.result.title}
                            </h3>
                          </div>
                          <p className="leading-loose">
                            {caseStudy.result.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Navigation Controls */}
          <div className="flex justify-between items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentCaseStudy(currentCaseStudy - 1)}
              className="w-15 h-15 bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all duration-200 cursor-pointer"
              aria-label="Previous technologies"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {/* Dot Indicators */}
            <div className="flex gap-2 p-4 border border-gray-200">
              {Array.from({ length: caseStudies.items.length }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCaseStudy(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      currentCaseStudy === index
                        ? "bg-secondary"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to technology ${index + 1}`}
                  />
                )
              )}
            </div>

            <button
              onClick={() => setCurrentCaseStudy(currentCaseStudy + 1)}
              className="w-15 h-15 bg-secondary text-white flex items-center justify-center hover:bg-secondary/90 transition-all duration-200 cursor-pointer"
              aria-label="Next technologies"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </Carousel>
      </div>
    </section>
  );
}
