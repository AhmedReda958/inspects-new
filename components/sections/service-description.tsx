import content from "@/content";
import { SectionTitle } from "@/components/ui/section-title";
import Image from "next/image";

export default function ServiceDescriptionSection() {
  return (
    <section
      id="service-description"
      className="bg-white py-20 lg:py-32 h-fit lg:h-screen overflow-hidden relative"
    >
      <div className="container mx-auto px-4 max-w-6xl h-full relative">
        <div className="flex flex-col items-center h-full md:flex-row gap-12 lg:gap-16">
          {/* Background Logo Image - Desktop Only */}

          <Image
            src="/logo.png"
            alt="Service Description"
            width={762}
            height={762}
            className="absolute top-10 -start-10  object-cover z-0 object-center opacity-20 w-7/12 hidden lg:block"
            draggable={false}
          />

          <div className="relative w-full h-[445px] lg:h-full max-h-[680px] lg:flex-1 flex items-center justify-center">
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
            <SectionTitle variant="start" className="mx-0">
              {content.serviceDescription.title}
            </SectionTitle>

            {/* Description */}
            <div className="space-y-6 max-w-[500px] w-full">
              {content.serviceDescription.description.map(
                (paragraph, index) => (
                  <p
                    key={index}
                    className="text-lg leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Background Image - Desktop Only */}

      <Image
        src="/images/bg/hero-bg.png"
        alt="Hero Background"
        width={400}
        height={400}
        className="absolute -bottom-10 -left-30 object-cover -z-10  w-1/2 opacity-70 hidden lg:block"
        draggable={false}
      />
    </section>
  );
}
