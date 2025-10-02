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
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";

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

export function ProblemsGallerySlider() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  React.useEffect(() => {
    if (api && setApi) {
      setApi(api);
    }
  }, [api, setApi]);

  const getItemSize = (index: number) => {
    const distance = Math.abs(index - current);

    if (index === current) {
      // Active item - biggest
      return "w-[300px] h-[370px] shadow-xl z-20";
    } else if (
      distance === 1 ||
      index === problemImages.length - 1 ||
      index === 0
    ) {
      // Adjacent items - normal
      return "w-[240px] h-[320px]";
    } else {
      // Other items - smaller
      return "w-[202px] h-[270px]";
    }
  };

  return (
    <>
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center", duration: 500 }}
        plugins={[
          Autoplay({
            stopOnInteraction: false,
            delay: 2500,
          }),
        ]}
        className="w-full max-w-7xl mx-auto"
        dir="ltr"
      >
        <CarouselContent className="-ml-1 flex items-end h-[480px] pb-8">
          {problemImages.map((image, index) => (
            <CarouselItem key={index} className="pl-1 basis-auto">
              <div className="p-1 md:p-4">
                <div
                  className={`
                  ${getItemSize(index)}
                  transition-all duration-200 ease-out
                  relative 
                `}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 202px, (max-width: 1024px) 240px, 300px"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-between items-center gap-4 md:gap-8 ">
          <button
            onClick={() => api?.scrollPrev()}
            className="w-12 h-12 md:w-14 md:h-14 bg-[#021A60] text-white flex items-center justify-center hover:bg-[#021A60]/90 transition-all duration-200 shadow-sm cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Problem Name */}
          <p className="text-xl font-medium ">{problemImages[current].alt}</p>

          <button
            onClick={() => api?.scrollNext()}
            className="w-12 h-12 md:w-14 md:h-14 bg-[#F25B06] text-white flex items-center justify-center hover:bg-[#F25B06]/90 transition-all duration-200 shadow-sm cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </Carousel>
    </>
  );
}

export default ProblemsGallerySlider;
