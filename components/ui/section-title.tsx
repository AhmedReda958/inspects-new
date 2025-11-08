import { cn } from "@/lib/utils";
import Image from "next/image";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  showDivider?: boolean;
  dividerClassName?: string;
  showLogo?: boolean;
  logoClassName?: string;
  variant?: "center" | "start" | "start-dark";
}

export function SectionTitle({
  children,
  className,
  showDivider = true,
  dividerClassName,
  showLogo = true,
  logoClassName,
  variant = "center",
}: SectionTitleProps) {
  const getDividerStyle = () => {
    switch (variant) {
      case "center":
        return {
          background:
            "linear-gradient(90deg, #001D6C 37.97%, #F25B06 37.98%, #F25B06 63.94%, #001D6C 63.95%)",
        };
      case "start":
        return {
          background:
            "linear-gradient(90deg, #001D6C 0%, #312A57 82.68%, #F25B06 82.69%, #F25B06 100%)",
        };
      case "start-dark":
        return {
          background:
            "linear-gradient(90deg, white 0%, white 82.6823%, #F25B06 82.6923%, #F25B06 100%)",
        };
      default:
        return {
          background:
            "linear-gradient(90deg, #001D6C 37.97%, #F25B06 37.98%, #F25B06 63.94%, #001D6C 63.95%)",
        };
    }
  };

  const getAlignmentClasses = () => {
    switch (variant) {
      case "center":
        return {
          container: "items-center text-center",
          logo: "mx-auto",
          title: "text-center",
          divider: "mx-auto",
        };
      case "start":
      case "start-dark":
        return {
          container: "items-start text-start",
          logo: "",
          title: "text-start",
          divider: "",
        };
      default:
        return {
          container: "items-center text-center",
          logo: "mx-auto",
          title: "text-center",
          divider: "mx-auto",
        };
    }
  };

  const alignmentClasses = getAlignmentClasses();

  return (
    <div className={cn("space-y-4", alignmentClasses.container)}>
      {/* Logo */}
      {showLogo && (
        <div
          className={cn(
            "w-13 h-13 flex items-center justify-center mb-4",
            alignmentClasses.logo,
            logoClassName
          )}
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={50}
            height={50}
            className="w-full h-full"
          />
        </div>
      )}

      <h2
        className={cn(
          "text-2xl lg:text-3xl font-bold text-foreground max-w-[489px] mx-auto",
          alignmentClasses.title,
          className
        )}
      >
        {children}
      </h2>
      {showDivider && (
        <div
          className={cn(
            "w-48 h-1.5 mt-8",
            alignmentClasses.divider,
            dividerClassName
          )}
          style={getDividerStyle()}
        />
      )}
    </div>
  );
}
