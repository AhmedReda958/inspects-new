"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import content from "@/content";
import { cn } from "@/lib/utils";

export function TestimonialsSlider() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const testimonials = content.testimonials.items;

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full max-w-6xl mx-auto" dir="ltr">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center" }}
        plugins={[
          Autoplay({
            delay: 2500,
          }),
        ]}
        className="w-full"
        dir="ltr"
      >
        <CarouselContent className="">
          {testimonials.map((testimonial, index) => (
            <CarouselItem
              key={index}
              className={cn("ml-4 basis-full md:basis-1/2 lg:basis-1/3", {
                "lg:border-x-1": current === index,
              })}
            >
              <div
                className="p-6 md:p-8 flex flex-col items-center text-center h-full bg-[url('/images/bg/quotation-bg.png')] bg-center bg-no-repeat"
                style={{
                  backgroundSize: "350px 276px",
                }}
              >
                {/* Client Image - Circular */}
                <div className="relative mb-6">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={90}
                    height={90}
                    priority={index < 3}
                    className="object-cover rounded-full w-[90px] h-[90px]"
                  />
                </div>

                {/* Testimonial Text */}
                <p className="text-sm md:text-base text-foreground leading-relaxed mb-6 flex-grow">
                  {testimonial.text}
                </p>

                {/* Client Info */}
                <div className="mt-auto">
                  <div className="font-bold text-primary text-sm  mb-1">
                    {testimonial.name}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center gap-4 mt-8">
          <button
            onClick={() => api?.scrollPrev()}
            className="w-10 h-10 md:w-12 md:h-12 bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all duration-200 cursor-pointer"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="flex gap-2 p-4 border">
            {Array.from({ length: testimonials.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  current === index
                    ? "bg-secondary"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => api?.scrollNext()}
            className="w-10 h-10 md:w-12 md:h-12 bg-secondary text-white flex items-center justify-center hover:bg-secondary/90 transition-all duration-200 cursor-pointer"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </Carousel>
    </div>
  );
}

export default TestimonialsSlider;
