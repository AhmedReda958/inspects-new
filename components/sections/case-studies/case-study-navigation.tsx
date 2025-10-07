import { CarouselApi } from "@/components/ui/carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface CaseStudyNavigationProps {
  api: CarouselApi;
  totalItems: number;
}

export function CaseStudyNavigation({
  api,
  totalItems,
}: CaseStudyNavigationProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    // Cleanup function
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="flex justify-between items-center gap-4" dir="ltr">
      <button
        onClick={() => api?.scrollPrev()}
        className="w-15 h-15 bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all duration-200 cursor-pointer"
        aria-label="Previous case study"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="flex gap-2 p-4 border border-gray-200">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              current === index
                ? "bg-secondary"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to case study ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => api?.scrollNext()}
        className="w-15 h-15 bg-secondary text-white flex items-center justify-center hover:bg-secondary/90 transition-all duration-200 cursor-pointer"
        aria-label="Next case study"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
