import content from "@/content";

interface Feature {
  title: string;
  description: string;
  highlighted?: boolean;
}

export default function WhyInspectexSection() {
  return (
    <section
      id="why-inspectex"
      className="bg-gradient-to-br from-primary via-primary to-black py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('/images/bg/pattern.png')] bg-repeat bg-center"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="space-y-16" dir="rtl">
          {/* Header */}
          <div className="text-right space-y-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-white/20 rounded"></div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white">
              {content.whyInspectex.title}
            </h2>
            <div className="w-48 h-1.5 bg-gradient-to-r from-white via-secondary to-white rounded-full"></div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              {content.whyInspectex.features
                .slice(0, 2)
                .map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {content.whyInspectex.features.slice(2).map((feature, index) => (
                <FeatureCard key={index + 2} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div className="absolute bottom-0 left-0 w-full h-full max-w-4xl">
        <div className="w-full h-full bg-gradient-to-r from-transparent to-white/5"></div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const isHighlighted = feature.highlighted;

  return (
    <div
      className={`p-8 rounded-lg border-2 relative ${
        isHighlighted
          ? "bg-white border-white"
          : "bg-transparent border-white/20"
      }`}
    >
      {/* Icon */}
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center absolute -top-12 left-8 ${
          isHighlighted ? "bg-primary" : "bg-white"
        }`}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isHighlighted ? "bg-white" : "bg-primary"
          }`}
        >
          <div
            className={`w-8 h-8 rounded ${
              isHighlighted ? "bg-primary" : "bg-white"
            }`}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-8 space-y-4 text-right">
        <h3
          className={`text-xl font-bold ${
            isHighlighted ? "text-primary" : "text-white"
          }`}
        >
          {feature.title}
        </h3>
        <p
          className={`leading-relaxed ${
            isHighlighted ? "text-muted-foreground" : "text-white/80"
          }`}
        >
          {feature.description}
        </p>
      </div>
    </div>
  );
}
