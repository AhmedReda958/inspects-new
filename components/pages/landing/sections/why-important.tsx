import content from "@/content";
import { SectionTitle } from "@/components/ui/section-title";
import { cn } from "@/lib/utils";

interface ReasonCardProps {
  number: string;
  title: string;
  description: string;
  highlighted?: boolean;
  className?: string;
  isActiveOnMobile?: boolean;
}

function ReasonCard({
  number,
  title,
  description,
  className,
  isActiveOnMobile = false,
}: ReasonCardProps) {
  return (
    <div
      className={cn(
        "p-[2px] group md:hover:z-10 transition-all duration-500 relative cursor-pointer",
        "bg-gradient-to-bl from-transparent via-transparent to-transparent",
        isActiveOnMobile && "md:bg-gradient-to-bl md:from-transparent md:via-transparent md:to-transparent bg-gradient-to-bl from-secondary via-white to-white",
        "md:hover:bg-gradient-to-bl md:hover:from-secondary md:hover:via-white md:hover:to-white",
        isActiveOnMobile && "md:shadow-none shadow-[0_58px_83px_rgba(93,104,126,0.09),0_132px_112px_rgba(93,104,126,0.05),0_234px_132px_rgba(93,104,126,0.01)]",
        "md:hover:shadow-[0_58px_83px_rgba(93,104,126,0.09),0_132px_112px_rgba(93,104,126,0.05),0_234px_132px_rgba(93,104,126,0.01)]",
        className
      )}
    >
      <div className={cn(
        "h-full p-8 pb-16 space-y-6 bg-background",
        isActiveOnMobile && "md:bg-background bg-white",
        "md:group-hover:bg-white"
      )}>
        {/* Number */}
        <div
          className={cn(
            "w-16 h-16 rotate-45 flex items-center justify-center text-white font-bold text-xl transition-all duration-300 will-change-auto cursor-pointer",
            isActiveOnMobile ? "md:rotate-45 rotate-0 bg-secondary md:bg-primary-light" : "bg-primary-light",
            "md:group-hover:rotate-0 md:group-hover:bg-secondary"
          )}
        >
          <span className={cn(
            "-rotate-45 transition-all duration-300",
            isActiveOnMobile && "md:-rotate-45 rotate-0",
            "md:group-hover:-rotate-0"
          )}>
            {number}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground leading-tight mt-10">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground leading-loose whitespace-pre-wrap">
          {description}
        </p>
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
                isActiveOnMobile={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
