import content from "@/content";
import { SectionTitle } from "@/components/ui/section-title";
import { cn } from "@/lib/utils";

interface ReasonCardProps {
  number: string;
  title: string;
  description: string;
  highlighted?: boolean;
  className?: string;
}

function ReasonCard({
  number,
  title,
  description,
  className,
}: ReasonCardProps) {
  return (
    <div
      className={cn(
        "p-[2px] group hover:z-10 transition-all duration-500 relative cursor-pointer",
        "bg-gradient-to-bl from-transparent via-transparent to-transparent",
        "hover:bg-gradient-to-bl hover:from-secondary hover:via-white hover:to-white",
        "hover:shadow-[0_58px_83px_rgba(93,104,126,0.09),0_132px_112px_rgba(93,104,126,0.05),0_234px_132px_rgba(93,104,126,0.01)]",
        className
      )}
    >
      <div className="h-full p-8 pb-16 space-y-6 bg-background group-hover:bg-white">
        {/* Number */}
        <div
          className={cn(
            "w-16 h-16 rotate-45 group-hover:rotate-0 flex items-center justify-center text-white font-bold text-xl bg-primary group-hover:bg-secondary transition-all duration-300 will-change-auto cursor-pointer"
          )}
        >
          <span className="-rotate-45 group-hover:-rotate-0 transition-all duration-300">
            {number}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground leading-tight mt-10">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function WhyImportantSection() {
  return (
    <section id="why-important" className="bg-white py-20 lg:py-32">
      <div className="container">
        <div className="space-y-16">
          {/* Header */}
          <SectionTitle variant="center" showLogo={false}>
            {content.whyImportant.title}
          </SectionTitle>

          {/* Reasons Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {content.whyImportant.reasons.map((reason, index) => (
              <ReasonCard
                key={index}
                number={reason.number}
                title={reason.title}
                description={reason.description}
                highlighted={reason.highlighted}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
