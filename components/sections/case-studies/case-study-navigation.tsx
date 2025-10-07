import { ArrowLeft, ArrowRight } from "lucide-react";

interface CaseStudyNavigationProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}

export function CaseStudyNavigation({
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  onDotClick,
}: CaseStudyNavigationProps) {
  return (
    <div className="flex justify-between items-center gap-4 mt-8">
      <button
        onClick={onPrevious}
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
            onClick={() => onDotClick(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              currentIndex === index
                ? "bg-secondary"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to case study ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-15 h-15 bg-secondary text-white flex items-center justify-center hover:bg-secondary/90 transition-all duration-200 cursor-pointer"
        aria-label="Next case study"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
