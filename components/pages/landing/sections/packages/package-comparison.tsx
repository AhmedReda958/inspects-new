"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import content from "@/content";
import { cn } from "@/lib/utils";
import { FaInfo } from "react-icons/fa6";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComparisonSectionProps {
  section: {
    id: string;
    title: string;
    tooltip?: string;
    visual: string[];
    comprehensive: string[];
    advanced: string[];
  };
  isOpen: boolean;
  onToggle: () => void;
}

function ComparisonSection({
  section,
  isOpen = true,
  onToggle,
}: ComparisonSectionProps) {
  return (
    <div className="w-full">
      {/* Header Row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-start gap-2 px-4 py-5 bg-background border-b border-border hover:bg-muted transition-colors"
      >
        <ChevronDown
          className={cn(
            "w-6 h-6 text-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />

        <span className="text-muted-foreground font-semibold text-base">
          {section.title}
        </span>
        {section.tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-4 h-4 rounded-full bg-primary-light text-primary-foreground text-sm flex items-center justify-center cursor-help">
                <FaInfo className="w-2 h-2" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm text-white">{section.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </button>

      {/* Content Rows */}
      {isOpen && (
        <div className="grid grid-cols-3">
          {/* Visual Package Column */}
          <div className="p-5 border-b border-border flex flex-col gap-2.5">
            {section.visual.map((item, idx) => {
              const isFirstItemHeader =
                idx === 0 && ["components", "devices"].includes(section.id);

              if (isFirstItemHeader) {
                return (
                  <div key={idx} className="mb-1">
                    <p className="text-foreground/85 text-base font-bold text-right leading-[1.875em]">
                      {item}
                    </p>
                  </div>
                );
              }

              return (
                <div key={idx} className="flex items-start gap-2.5">
                  <Check
                    className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-chart-2"
                    strokeWidth={2.5}
                  />
                  <p className="text-muted-foreground/70 text-base font-medium text-right leading-[1.8125em]">
                    {item}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Comprehensive Package Column */}
          <div className="p-5 border-b border-x border-border flex flex-col gap-2.5">
            {section.comprehensive.map((item, idx) => {
              const isFirstItemHeader =
                idx === 0 && ["components", "devices"].includes(section.id);

              if (isFirstItemHeader) {
                return (
                  <div key={idx} className="mb-1">
                    <p className="text-foreground/85 text-base font-bold text-right leading-[1.875em]">
                      {item}
                    </p>
                  </div>
                );
              }

              return (
                <div key={idx} className="flex items-start gap-2.5">
                  <Check
                    className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-chart-2"
                    strokeWidth={2.5}
                  />
                  <p className="text-muted-foreground/70 text-base font-medium text-right leading-[1.8125em]">
                    {item}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Advanced Package Column */}
          <div className="p-5 border-b border-border flex flex-col gap-2.5">
            {section.advanced.map((item, idx) => {
              const isFirstItemHeader =
                idx === 0 && ["components", "devices"].includes(section.id);

              if (isFirstItemHeader) {
                return (
                  <div key={idx} className="mb-1">
                    <p className="text-foreground/85 text-base font-bold text-right leading-[1.875em]">
                      {item}
                    </p>
                  </div>
                );
              }

              return (
                <div key={idx} className="flex items-start gap-2.5">
                  <Check
                    className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-chart-2"
                    strokeWidth={2.5}
                  />
                  <p className="text-muted-foreground/70 text-base font-medium text-right leading-[1.8125em]">
                    {item}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function PackageComparison() {
  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >(() => {
    const firstSectionId = content.packages.comparison.sections[0]?.id;
    return firstSectionId ? { [firstSectionId]: true } : {};
  });

  function toggleSection(sectionId: string) {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }

  return (
    <div className="w-full max-w-7xl mx-auto rounded-[10px] overflow-hidden bg-card border border-border">
      {/* Package Headers */}
      <div className="grid grid-cols-3 border-b border-border">
        <div className="p-6  flex items-end  rounded-tl-[10px]">
          <h3 className="text-foreground font-extrabold text-xl leading-[2em] text-right">
            {
              content.packages.items.find((item) => item.id === "advanced")
                ?.title
            }
          </h3>
        </div>
        <div className="p-6 border-l border-r border-border flex items-end ">
          <h3 className="text-foreground font-extrabold text-xl leading-[2em] text-right">
            {
              content.packages.items.find((item) => item.id === "comprehensive")
                ?.title
            }
          </h3>
        </div>
        <div className="p-6  border-border flex items-end  rounded-tr-[10px]">
          <h3 className="text-foreground font-extrabold text-xl leading-[2em] text-right">
            {content.packages.items.find((item) => item.id === "visual")?.title}
          </h3>
        </div>
      </div>

      {/* Comparison Sections */}
      {content.packages.comparison.sections.map((section) => (
        <ComparisonSection
          key={section.id}
          section={section}
          isOpen={openSections[section.id]}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  );
}
