"use client";

import * as React from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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

export function ProblemsGallerySlider({
  setApi,
}: {
  setApi: (api: CarouselApi) => void;
}) {
  const [api, setInternalApi] = React.useState<CarouselApi>();
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
      return "w-[300px] h-[370px] shadow-2xl z-20";
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
    <Carousel
      setApi={setInternalApi}
      opts={{ loop: true, align: "center", duration: 500 }}
      plugins={[
        Autoplay({
          stopOnInteraction: false,
          delay: 2500,
        }),
      ]}
      className="w-full max-w-7xl mx-auto "
      dir="ltr"
    >
      <CarouselContent className="-ml-1 flex items-end h-[480px] pb-10">
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
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default ProblemsGallerySlider;
