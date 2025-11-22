import content from "@/content";
import { SectionTitle } from "@/components/ui/section-title";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Import icons using SVGR
import Icon1 from "@/icons/why-us/icon-1.svg";
import Icon2 from "@/icons/why-us/icon-2.svg";
import Icon3 from "@/icons/why-us/icon-3.svg";
import Icon4 from "@/icons/why-us/icon-4.svg";
import Icon5 from "@/icons/why-us/icon-5.svg";

interface Feature {
  title: string;
  description: string;
}

// Icon mapping for features
const iconMap = [Icon1, Icon2, Icon3, Icon4, Icon5];

export default function WhyInspectexSection() {
  return (
    <section
      id="why-inspectex"
      className="bg-primary py-20 lg:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-16 gap-y-24">
          {/* header */}
          <div className="flex items-center justify-start">
            <SectionTitle variant="start-dark" className="text-white">
              {content.whyInspectex.title}
            </SectionTitle>
          </div>
          {/* content */}
          {content.whyInspectex.features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} iconIndex={index} />
          ))}
        </div>
      </div>
      <div className="absolute -top-14 left-0 h-full  w-1/2">
        <Image
          src="/images/bg/why-inspectex-bg.svg"
          alt="Why Inspectex Background"
          fill
          className="h-full hidden xl:block"
        />
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  iconIndex,
}: {
  feature: Feature;
  iconIndex: number;
}) {
  const IconComponent = iconMap[iconIndex];

  return (
    <div
      className={cn(
        "p-8 pb-14 border-1 relative bg-transparent group transition-all duration-300 cursor-pointer z-20",
        // Default border for all cards
        "border-white/70",
        // Hover effect for ALL cards on desktop
        "md:hover:border-white",
        // Mobile: active styles for odd cards only
        "max-md:odd:border-white"
      )}
    >
      {/* Icon */}
      {
        <div
          className={`w-24 h-24 bg-primary rounded-full flex items-center justify-center absolute -top-12  right-8 `}
        >
          <IconComponent
            className={cn(
              "w-[75px] h-[75px] transition-colors duration-300",
              // Default: white for all cards
              "text-white",
              // Hover effect for ALL cards on desktop
              "md:group-hover:text-secondary",
              // Mobile: active styles for odd cards only
              "max-md:odd:text-secondary"
            )}
          />
        </div>
      }

      {/* Content */}
      <div className="pt-8 space-y-4 text-right">
        <h3
          className={cn(
            "text-xl font-bold transition-colors duration-300",
            // Default: white for all cards
            "text-white",
            // Hover effect for ALL cards on desktop
            "md:group-hover:text-secondary",
            // Mobile: active styles for odd cards only
            "max-md:odd:text-secondary"
          )}
        >
          {feature.title}
        </h3>
        <p
          className={cn(
            "leading-10 transition-colors duration-300",
            // Default: white/60 for all cards
            "text-white/60",
            // Hover effect for ALL cards on desktop
            "md:group-hover:text-white",
            // Mobile: active styles for odd cards only
            "max-md:odd:text-white"
          )}
        >
          {feature.description}
        </p>
      </div>
    </div>
  );
}
