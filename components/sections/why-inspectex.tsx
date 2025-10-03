import content from "@/content";
import { SectionTitle } from "../ui/section-title";
import Image from "next/image";

// Import icons using SVGR
import Icon1 from "../../icons/why-us/icon-1.svg";
import Icon2 from "../../icons/why-us/icon-2.svg";
import Icon3 from "../../icons/why-us/icon-3.svg";
import Icon4 from "../../icons/why-us/icon-4.svg";
import Icon5 from "../../icons/why-us/icon-5.svg";

interface Feature {
  title: string;
  description: string;
  highlighted?: boolean;
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
            <FeatureCard
              key={index}
              feature={feature}
              iconIndex={index}
              highlighted={feature.highlighted || false}
            />
          ))}
        </div>
      </div>
      <div className="absolute -top-14 left-0 h-full z-20 w-1/2">
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
  highlighted,
}: {
  feature: Feature;
  iconIndex: number;
  highlighted?: boolean;
}) {
  const IconComponent = iconMap[iconIndex];

  return (
    <div
      className={`p-8 pb-14 border-1 relative bg-primary ${
        highlighted ? "border-white" : "border-white/70"
      }`}
    >
      {/* Icon */}
      {
        <div
          className={`w-24 h-24 bg-primary rounded-full flex items-center justify-center absolute -top-12  right-8 `}
        >
          <IconComponent className="w-[75px] h-[75px] text-white" />
        </div>
      }

      {/* Content */}
      <div className="pt-8 space-y-4 text-right">
        <h3
          className={`text-xl font-bold ${
            highlighted ? "text-secondary" : "text-white"
          }`}
        >
          {feature.title}
        </h3>
        <p
          className={`leading-10 ${
            highlighted ? "text-white" : "text-white/60"
          }`}
        >
          {feature.description}
        </p>
      </div>
    </div>
  );
}
