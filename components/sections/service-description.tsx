"use client";

import content from "@/content";
import { SectionTitle } from "@/components/ui/section-title";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ServiceDescriptionSection() {
  const isMobile = useIsMobile();

  return (
    <section
      id="service-description"
      className="bg-white py-20 lg:py-32 h-fit lg:h-screen"
    >
      <div className="container mx-auto px-4 max-w-6xl h-full relative">
        <div className="flex flex-col items-center h-full lg:flex-row gap-12 lg:gap-16">
          {/* Background Logo Image - Desktop Only */}
          {!isMobile && (
            <Image
              src="/logo.svg"
              alt="Service Description"
              width={762}
              height={762}
              className="absolute top-10 -start-10  object-cover z-0 object-center opacity-20 w-7/12"
            />
          )}
          <div className="relative w-full h-[445px] lg:h-full lg:flex-1 flex items-center justify-center">
            <Image
              src="/images/sections/service-description/section-image.png"
              alt="Service Description"
              fill
              className="rounded-tr-[100px] rounded-bl-[100px] object-cover"
              objectFit="cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-8 w-full lg:flex-1">
            {/* Title with divider */}
            <SectionTitle variant="start">
              {content.serviceDescription.title}
            </SectionTitle>

            {/* Description */}
            <div className="space-y-6 max-w-[500px] w-full">
              {content.serviceDescription.description.map(
                (paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed">
                    {paragraph}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
