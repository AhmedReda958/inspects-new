import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";

const animatedButtonVariants = cva(
  "relative group transition-all duration-300 font-medium border overflow-hidden cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-transparent text-primary-foreground lg:text-primary hover:text-primary-foreground border-primary",
        secondary:
          "bg-transparent text-secondary-foreground lg:text-secondary hover:text-secondary-foreground border-secondary",
        accent:
          "bg-transparent text-accent-foreground lg:text-accent hover:text-accent-foreground border-accent",
      },
      size: {
        default: "px-8 py-4",
        sm: "px-6 py-3 text-sm",
        lg: "px-10 py-5 text-lg",
      },
      animation: {
        expand: "", // Default expanding animation
        slide: "", // Could add slide animation variant in future
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      animation: "expand",
    },
  }
);

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedButtonVariants> {
  children: React.ReactNode;
  href?: string;
}

function AnimatedButton({
  className,
  variant,
  size,
  animation,
  children,
  href,
  ...props
}: AnimatedButtonProps) {
  const getAnimationClasses = () => {
    switch (variant) {
      case "secondary":
        return "absolute inset-0 w-full h-full lg:w-2.5 lg:h-2.5 bg-secondary group-hover:w-full group-hover:h-full transition-all duration-300 z-0";
      case "accent":
        return "absolute inset-0 w-full h-full lg:w-2.5 lg:h-2.5 bg-accent group-hover:w-full group-hover:h-full transition-all duration-300 z-0";
      default:
        return "absolute inset-0 w-full h-full lg:w-2.5 lg:h-2.5 bg-primary group-hover:w-full group-hover:h-full transition-all duration-300 z-0";
    }
  };

  return (
    <button
      className={cn(
        animatedButtonVariants({ variant, size, animation }),
        className
      )}
      {...props}
    >
      {href ? (
        <Link href={href} className="relative z-10">
          {children}
        </Link>
      ) : (
        <>
          <span className="relative z-10">{children}</span>
        </>
      )}
      <div className={getAnimationClasses()} />
    </button>
  );
}

export { AnimatedButton, animatedButtonVariants };
