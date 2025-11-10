"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Package {
  id: string;
  title: string;
  icon: React.ReactNode;
  price: string;
  features: string[];
  isHighlighted?: boolean;
}

// Mapping between package IDs and calculator package values
const packageIdToCalculatorValue: Record<string, string> = {
  visual: "basic",
  comprehensive: "premium",
  advanced: "vip",
};

// Helper function to highlight numbers with secondary color
const highlightNumbers = (text: string) => {
  // Match numbers (including Arabic-Indic numerals, Western numerals, percentages, and numbers with commas)
  const numberRegex = /([\d٠-٩]+[،,]?[\d٠-٩]*%?)/g;
  const parts = text.split(numberRegex);

  return parts.map((part, index) => {
    // Check if part is a number by testing against the regex pattern
    if (/^[\d٠-٩]+[،,]?[\d٠-٩]*%?$/.test(part)) {
      return (
        <span key={index} className="text-secondary">
          {part}
        </span>
      );
    }
    return part;
  });
};

export function PackageCard({
  pkg,
  className = "",
}: {
  pkg: Package;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleButtonClick() {
    const calculatorValue = packageIdToCalculatorValue[pkg.id];
    if (calculatorValue) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("package", calculatorValue);
      router.push(`?${params.toString()}`, { scroll: false });
      
      // Scroll to calculator section
      setTimeout(() => {
        const calculatorElement = document.getElementById("price-calculator");
        if (calculatorElement) {
          calculatorElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }

  return (
    <Card
      className={cn(
        "relative rounded-xl h-full flex flex-col border shadow-none p-1",
        pkg.isHighlighted && [
          "lg:drop-shadow-2xl  border-none z-10",
          "bg-gradient-to-t from-background via-background to-secondary/50",
        ],
        !pkg.isHighlighted && "border-gray-200 bg-background/80",
        className
      )}
    >
      <div
        className={cn(
          "h-full w-full flex flex-col rounded-lg",
          pkg.isHighlighted ? " bg-white" : "bg-background/80"
        )}
      >
        <CardContent className="flex flex-col items-center text-center h-full py-10 px-7">
          {/* Header with Icon and Text */}
          <div className="flex items-center gap-4 w-full mb-8" dir="rtl">
            {/* Icon */}
            <div className="flex-shrink-0 w-20 h-20 bg-primary/3 rounded-lg flex items-center justify-center">
              {pkg.icon}
            </div>

            {/* Title and Price */}
            <div className="flex flex-col items-start text-start">
              {/* Title */}
              <h2
                className={cn(
                  "font-bold mb-2 text-lg",
                  pkg.isHighlighted && "text-primary-lighter"
                )}
              >
                {pkg.title}
              </h2>

              {/* Price */}
              <div
                className={cn(
                  "text-base text-primary-lighter",
                  pkg.isHighlighted && "text-secondary"
                )}
              >
                {pkg.price}
              </div>
            </div>
          </div>

          {/* Features List */}
          <ul
            className="flex-1 flex flex-col gap-4 w-full text-start mb-8"
            dir="rtl"
          >
            {pkg.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-base font-medium text-foreground/90 leading-relaxed"
              >
                <div className="flex items-center justify-center bg-primary/3 rounded-full w-8 h-8 flex-shrink-0">
                  <Check className="size-4 " />
                </div>

                <span>{highlightNumbers(feature)}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Button
            size={"lg"}
            onClick={handleButtonClick}
            className={cn(
              "w-full mt-auto text-base font-medium h-16 cursor-pointer",
              pkg.isHighlighted
                ? "bg-secondary text-white hover:bg-secondary/90"
                : "bg-gray-200 text-primary hover:bg-gray-300"
            )}
          >
            اطلب الباقة الان
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}

