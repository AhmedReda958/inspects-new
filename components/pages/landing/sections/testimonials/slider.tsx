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
  const [expandedTestimonials, setExpandedTestimonials] = React.useState<
    Set<number>
  >(new Set());
  const testimonials = content.testimonials.items;

  // Function to check if text exceeds 5 lines
  const isTextLong = (text: string) => {
    const words = text.split(" ");
    return words.length > 30; // Approximate 6 words per line, so 30 words = 5 lines
  };

  // Function to truncate text to approximately 5 lines
  const truncateText = (text: string) => {
    const words = text.split(" ");
    return words.slice(0, 30).join(" ") + (words.length > 30 ? "..." : "");
  };

  // Function to toggle expanded state
  const toggleExpanded = (index: number) => {
    setExpandedTestimonials((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

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
        opts={{ loop: true, align: "center", duration: 30 }}
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
          {testimonials.map((testimonial, index) => (
            <CarouselItem
              key={index}
              className={cn("ml-4 basis-full md:basis-1/2 lg:basis-1/3", {
                "lg:border-x-1": current === index,
              })}
            >
              <div
                className="p-6 md:p-8 flex flex-col items-center text-center h-full bg-[url('/images/bg/quotation-bg.png')] bg-center bg-no-repeat transition-all duration-500 ease-in-out"
                style={{
                  backgroundSize: "350px 276px",
                }}
              >
                {/* Client Image - Circular */}
                <div className="relative mb-6 transition-all duration-500 ease-in-out">
                  {testimonial.image ? (
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={90}
                      height={90}
                      priority={index < 3}
                      className="object-cover rounded-full w-[90px] h-[90px]"
                    />
                  ) : (
                    <div className="w-[90px] h-[90px] rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Testimonial Text */}
                <div className="text-sm md:text-base text-foreground leading-relaxed mb-6 flex-grow">
                  <p className="whitespace-pre-line">
                    {isTextLong(testimonial.text) &&
                    !expandedTestimonials.has(index)
                      ? truncateText(testimonial.text)
                      : testimonial.text}
                  </p>
                  {isTextLong(testimonial.text) && (
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="text-primary hover:text-primary/80 text-sm font-medium mt-2 transition-colors duration-200"
                    >
                      {expandedTestimonials.has(index)
                        ? "عرض أقل"
                        : "عرض المزيد"}
                    </button>
                  )}
                </div>

                {/* Client Info */}
                <div className="mt-0">
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
