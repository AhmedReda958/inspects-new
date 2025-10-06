"use client";

import * as React from "react";
import { SectionTitle } from "@/components/ui/section-title";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import content from "@/content";
import { cn } from "@/lib/utils";
import Icon1 from "@/icons/packages/1.svg";
import Icon2 from "@/icons/packages/2.svg";
import Icon3 from "@/icons/packages/3.svg";

interface Package {
  id: string;
  title: string;
  icon: React.ReactNode;
  price: string;
  features: string[];
  isHighlighted?: boolean;
}

const getPackageIcon = (id: string) => {
  switch (id) {
    case "bronze":
      return <Icon3 className="w-20 h-20 lg:w-24 lg:h-24" />;
    case "premium":
      return <Icon2 className="w-20 h-20 lg:w-24 lg:h-24" />;
    case "basic":
      return <Icon1 className="w-20 h-20 lg:w-24 lg:h-24" />;
    default:
      return null;
  }
};

const packages: Package[] = content.packages.items.map((pkg) => ({
  ...pkg,
  icon: getPackageIcon(pkg.id),
}));

const PackageCard = ({
  pkg,
  className = "",
}: {
  pkg: Package;
  className?: string;
}) => {
  return (
    <Card
      className={cn(
        "relative  rounded-none h-fit pt-0  lg:first:border-e-0 lg:last:border-s-0 shadow-none bg-background",
        pkg.isHighlighted && [
          "lg:drop-shadow-2xl p-1  border-0 z-10  ",
          "bg-gradient-to-t from-background via-background to-secondary/50",
        ],
        className
      )}
    >
      <div
        className={cn("h-full w-full bg-background py-[50px]", {
          "py-[80px] bg-white": pkg.isHighlighted,
        })}
      >
        <CardContent className=" !pt-0  flex flex-col items-center text-center h-full ">
          {/* Icon */}
          <div className="mb-4">{pkg.icon}</div>

          {/* Title */}
          <h2 className="font-bold text-primary mb-4" dir="rtl">
            {pkg.title}
          </h2>

          {/* Price */}
          <div className="mb-8" dir="rtl">
            <div className="text-xl font-bold text-secondary">{pkg.price}</div>
          </div>

          {/* Features List */}
          <ul
            className="h-full flex flex-col gap-5 w-full text-center"
            dir="rtl"
          >
            {pkg.features.map((feature, index) => (
              <li
                key={index}
                className="text-sm text-foreground leading-relaxed"
              >
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </div>
    </Card>
  );
};

export default function PackagesSection() {
  const isMobile = useIsMobile();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section id="packages" className="min-h-screen py-20 md:py-32 bg-white">
      <div className="container space-y-24 px-0">
        <SectionTitle>{content.packages.title}</SectionTitle>

        {isMobile ? (
          // Mobile: Carousel
          <div className="relative px-4">
            <Carousel setApi={setApi} className="w-full " dir="ltr">
              <CarouselContent>
                {packages.map((pkg) => (
                  <CarouselItem
                    key={pkg.id}
                    className="basis-3/4 lg:basis-auto flex items-end"
                  >
                    <PackageCard pkg={pkg} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Dot Indicators */}
              <div className="flex gap-2 justify-center p-10   ">
                {Array.from({ length: packages.length }).map((_, index) => (
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
            </Carousel>
          </div>
        ) : (
          // Desktop: Grid
          <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto items-end">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
