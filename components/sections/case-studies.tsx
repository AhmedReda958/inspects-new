"use client";

import { SectionTitle } from "@/components/ui/section-title";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import content from "@/content";
import Image from "next/image";
import BrandBlueSquare from "@/icons/brand-blue-square.svg";

export function CaseStudies() {
  const { caseStudies } = content;

  return (
    <section className="py-16 bg-white" id="case-studies">
      <div className="container">
        <SectionTitle variant="center">{caseStudies.title}</SectionTitle>

        <Carousel className="w-full max-w-6xl mx-auto mt-12">
          <CarouselContent>
            {caseStudies.items.map((caseStudy) => (
              <CarouselItem key={caseStudy.id}>
                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="p-0">
                    {/* Responsive Layout - Same HTML structure for both desktop and mobile */}
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                      {/* Image Section */}
                      <div className="w-full lg:flex-1 relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={caseStudy.image}
                          alt="Case Study"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content Section */}
                      <div className="w-full lg:flex-1 space-y-6 ">
                        {/* Property Details */}
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-4  bg-background p-10 text-center *:space-y-2 *:pb-4 *:border-b *:w-fit mb-10">
                          <div>
                            <h3 className="font-bold text-primary">
                              قيمة العقار
                            </h3>
                            <p className="text-foreground font-medium">
                              {caseStudy.propertyValue}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-bold text-primary">الموقع</h3>
                            <p className="text-foreground">
                              {caseStudy.location}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-bold text-primary">المشكلة</h3>
                            <p className="text-foreground">
                              {caseStudy.problem}
                            </p>
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
          <CarouselPrevious className="bg-primary text-white hover:bg-primary-light border-primary" />
          <CarouselNext className="bg-secondary text-white hover:bg-secondary/90 border-secondary" />
        </Carousel>
      </div>
    </section>
  );
}
