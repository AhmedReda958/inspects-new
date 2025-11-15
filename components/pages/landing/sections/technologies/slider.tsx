"use client";

import * as React from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import content from "@/content";
import { cn } from "@/lib/utils";

export function TechnologiesSlider() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const technologies = content.technologies.items;

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "end", duration: 30 }}
        plugins={[
          Autoplay({
            delay: 2500,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
        dir="ltr"
      >
        <CarouselContent className="">
          {technologies.map((technology, index) => (
            <CarouselItem
              key={technology.id}
              className="basis-auto w-[275px] md:basis-1/2 lg:basis-1/4"
            >
              <div className="p-6 md:p-8 flex flex-col items-center text-center h-full bg-white border transition-all duration-500 ease-in-out">
                {/* Technology Image Container */}
                <div className="relative mb-5 w-full h-48 bg-white overflow-hidden">
                  <Image
                    src={technology.image}
                    alt={technology.name}
                    fill
                    priority={index < 4}
                    className="object-contain"
                  />
                </div>

                {/* Technology Title */}
                <div
                  className={cn(
                    "font-bold text-primary text-lg mb-4 leading-tight transition-all duration-500 ease-in-out",
                    { "text-secondary": current === index }
                  )}
                >
                  {technology.name}
                </div>

                {/* Technology Description */}
                <p className="text-sm text-gray-600 leading-relaxed text-center">
                  {technology.description}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center gap-4 mt-8">
          <button
            onClick={() => api?.scrollPrev()}
            className="w-15 h-15 bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all duration-200 cursor-pointer"
            aria-label="Previous technologies"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {/* Dot Indicators */}
          <div className="flex gap-2 p-4 border border-gray-200">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  current === index
                    ? "bg-secondary"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to technology ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => api?.scrollNext()}
            className="w-15 h-15 bg-secondary text-white flex items-center justify-center hover:bg-secondary/90 transition-all duration-200 cursor-pointer"
            aria-label="Next technologies"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </Carousel>
    </div>
  );
}

export default TechnologiesSlider;
