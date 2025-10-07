import { cn } from "@/lib/utils";
import Icon1 from "@/icons/workflow/1.svg";
import Icon2 from "@/icons/workflow/2.svg";
import Icon3 from "@/icons/workflow/3.svg";
import Icon4 from "@/icons/workflow/4.svg";
import Icon5 from "@/icons/workflow/5.svg";
import Icon6 from "@/icons/workflow/6.svg";
import Icon7 from "@/icons/workflow/7.svg";
import Icon8 from "@/icons/workflow/8.svg";

interface WorkflowStepCardProps {
  number: string;
  title: string;
  description: string;
  className?: string;
}

const getIconComponent = (stepNumber: string) => {
  const iconProps = {
    className: "w-[45px] h-[45px]",
  };

  switch (stepNumber) {
    case "01":
      return <Icon1 {...iconProps} />;
    case "02":
      return <Icon2 {...iconProps} />;
    case "03":
      return <Icon3 {...iconProps} />;
    case "04":
      return <Icon4 {...iconProps} />;
    case "05":
      return <Icon5 {...iconProps} />;
    case "06":
      return <Icon6 {...iconProps} />;
    case "07":
      return <Icon7 {...iconProps} />;
    case "08":
      return <Icon8 {...iconProps} />;
    default:
      return <Icon1 {...iconProps} />;
  }
};

const getColorByNumber = (number: string) => {
  switch (number) {
    case "01":
      return "#9AD1CB";
    case "02":
      return "#9F91C5";
    case "03":
      return "#799BFD";
    case "04":
      return "#1FC16B";
    case "05":
      return "#F25B06";
    case "06":
      return "#777777";
    case "07":
      return "#DFB400";
    case "08":
      return "#032DA6";
    default:
      return "#777777";
  }
};

export function WorkflowStepCard({
  number,
  title,
  description,
  className,
}: WorkflowStepCardProps) {
  const numberColor = getColorByNumber(number);

  return (
    <div className={cn("flex flex-col items-end", className)}>
      {/* Step Header */}
      <div className="w-full h-[101px] relative">
        {/* Step Number */}
        <div
          className="text-[160px] font-bold leading-[100px] text-center relative z-0"
          style={{
            color: numberColor,
            top: "26px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {number}
        </div>

        {/* Step Divider */}
        <div
          className="absolute h-[3px] w-full max-w-[225px] left-1/2 bottom-0 -translate-x-1/2"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0px -6px 24px 0px rgba(0, 0, 0, 0.75)",
          }}
        />
      </div>

      {/* Step Content */}
      <div className="flex flex-col items-center gap-5 p-5 pt-8 bg-background w-full z-10">
        {/* Icon */}
        <div className="w-[45px] h-[45px]">{getIconComponent(number)}</div>

        {/* Step Title */}
        <h3 className="text-xl font-bold text-primary leading-[1.5em] text-center">
          {title}
        </h3>

        {/* Step Description */}
        <p className="text-base font-medium text-neutral-500 leading-loose text-center  whitespace-pre-wrap">
          {description}
        </p>
      </div>
    </div>
  );
}
