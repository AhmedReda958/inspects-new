import content from "@/content";
import { SectionTitle } from "../ui/section-title";

interface Feature {
  title: string;
  description: string;
  highlighted?: boolean;
}

export default function WhyInspectexSection() {
  return (
    <section
      id="why-inspectex"
      className="bg-primary py-20 lg:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* header */}
          <div className="flex items-center justify-start">
            <SectionTitle variant="start-dark" className="text-white">
              {content.whyInspectex.title}
            </SectionTitle>
          </div>
          {/* content */}
          {content.whyInspectex.features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className={`p-8  border-1 border-white/70 relative `}>
      {/* Icon */}
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center absolute -top-12 left-8`}
      ></div>

      {/* Content */}
      <div className="pt-8 space-y-4 text-right">
        <h3 className={`text-xl font-bold text-white`}>{feature.title}</h3>
        <p className={`leading-relaxed text-white/60`}>{feature.description}</p>
      </div>
    </div>
  );
}
