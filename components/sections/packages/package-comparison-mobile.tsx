"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import content from "@/content";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon1 from "@/icons/packages/1.svg";
import Icon2 from "@/icons/packages/2.svg";
import Icon3 from "@/icons/packages/3.svg";

// Mapping between package IDs and calculator package values
const packageIdToCalculatorValue: Record<string, string> = {
  visual: "basic",
  comprehensive: "premium",
  advanced: "vip",
};

const getPackageIcon = (id: string) => {
  switch (id) {
    case "visual":
      return <Icon1 />;
    case "comprehensive":
      return <Icon2 />;
    case "advanced":
      return <Icon3 />;
    default:
      return null;
  }
};

interface PackageComparisonMobileProps {
  packageId: "visual" | "comprehensive" | "advanced";
  packageTitle: string;
  packagePrice: string;
  isOpen: boolean;
  onToggle: () => void;
}

function PackageComparisonMobile({
  packageId,
  packageTitle,
  packagePrice,
  isOpen,
  onToggle,
}: PackageComparisonMobileProps) {
  const icon = getPackageIcon(packageId);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleButtonClick() {
    const calculatorValue = packageIdToCalculatorValue[packageId];
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
        "relative rounded-xl h-full flex flex-col border-none shadow-none p-[2px]",
        packageId === "comprehensive" && [
          "bg-gradient-to-t from-background via-background to-secondary/50",
        ],
        packageId !== "comprehensive" && " bg-background/80"
      )}
    >
      <div
        className={cn(
          "h-full w-full flex flex-col rounded-xl overflow-hidden",
          packageId === "comprehensive" ? "bg-white" : "bg-background/80"
        )}
      >
        {/* Card Header - Always Visible */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4" dir="rtl">
            {/* Icon */}
            <div className="flex-shrink-0 w-16 h-16 bg-primary/3 rounded-lg flex items-center justify-center">
              {icon}
            </div>

            {/* Title and Price */}
            <div className="flex flex-col items-start text-start">
              <h3 className={cn("font-bold text-lg mb-1 text-primary")}>
                {packageTitle}
              </h3>
              <div
                className={cn(
                  "text-base",
                  packageId === "comprehensive"
                    ? "text-secondary"
                    : "text-primary-lighter"
                )}
              >
                {packagePrice}
              </div>
            </div>
          </div>

          {/* Arrow with Text */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-medium text-foreground">
              التفاصيل
            </span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-foreground transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </button>

        {/* Card Content - Collapsible */}
        {isOpen && (
          <CardContent className="px-6 pb-6 pt-0">
            <div className="space-y-5" dir="rtl">
              {content.packages.comparison.sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  {/* Section Title with Bullet */}
                  <div className="flex items-start gap-2">
                    <span className="text-foreground text-base mt-0.5">•</span>
                    <h4 className="text-foreground font-semibold text-base leading-relaxed text-right flex-1">
                      {section.title}
                    </h4>
                  </div>

                  {/* Section Items */}
                  <div className="space-y-1.5 ">
                    {section[packageId].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check
                          className="w-4 h-4 mt-0.5 -ms-1 flex-shrink-0 text-chart-2"
                          strokeWidth={2.5}
                        />
                        <p className="text-muted-foreground/70 text-sm font-normal text-right leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  size="lg"
                  onClick={handleButtonClick}
                  className={cn(
                    "w-full text-base font-medium h-14 cursor-pointer",
                    packageId === "comprehensive"
                      ? "bg-secondary text-white hover:bg-secondary/90"
                      : "bg-gray-200 text-primary hover:bg-gray-300"
                  )}
                >
                  اطلب الباقة الان
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </div>
    </Card>
  );
}

export function PackageComparisonMobileList() {
  const [openPackage, setOpenPackage] = React.useState<string | null>(null);

  function togglePackage(packageId: string) {
    setOpenPackage((prev) => (prev === packageId ? null : packageId));
  }

  const packages = [
    {
      id: "advanced" as const,
      title:
        content.packages.items.find((item) => item.id === "advanced")?.title ||
        "",
      price:
        content.packages.items.find((item) => item.id === "advanced")?.price ||
        "",
    },
    {
      id: "comprehensive" as const,
      title:
        content.packages.items.find((item) => item.id === "comprehensive")
          ?.title || "",
      price:
        content.packages.items.find((item) => item.id === "comprehensive")
          ?.price || "",
    },
    {
      id: "visual" as const,
      title:
        content.packages.items.find((item) => item.id === "visual")?.title ||
        "",
      price:
        content.packages.items.find((item) => item.id === "visual")?.price ||
        "",
    },
  ];

  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <PackageComparisonMobile
          key={pkg.id}
          packageId={pkg.id}
          packageTitle={pkg.title}
          packagePrice={pkg.price}
          isOpen={openPackage === pkg.id}
          onToggle={() => togglePackage(pkg.id)}
        />
      ))}
    </div>
  );
}
