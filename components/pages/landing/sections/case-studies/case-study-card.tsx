import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CaseStudyDetails } from "./case-study-details";
import { CaseStudyContent } from "./case-study-content";

interface CaseStudy {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  propertyValue: string;
  location: string;
  challenge: {
    title: string;
    content: string;
  };
  whatWeProvided: {
    title: string;
    items: string[];
  };
  result: {
    title: string;
    items?: string[];
    content?: string;
  };
  impact?: {
    title: string;
    items: string[];
  };
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0" dir="rtl">
        {/* Grid Layout - Content takes 2/3 on desktop, full width on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Image Section - 1/3 on desktop, full width on mobile */}
          <div className="lg:col-span-5 relative  lg:aspect-auto h-[450px] lg:h-[calc(100vh-100px)] overflow-hidden lg:order-last">
            {/* Mobile Image */}
            <Image
              src={caseStudy.image.replace(
                "/case-studies/",
                "/case-studies/mobile/"
              )}
              alt="Case Study"
              fill
              className="object-contain lg:hidden"
            />
            {/* Desktop Image */}
            <Image
              src={caseStudy.image}
              alt="Case Study"
              fill
              className="object-contain hidden lg:block"
            />
          </div>

          {/* Content Section - 2/3 on desktop, full width on mobile */}
          <div className="lg:col-span-7 space-y-6">
            {/* Case Study Title and Subtitle */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">
                {caseStudy.title}
              </h2>
              <p className="text-lg text-foreground leading-relaxed">
                {caseStudy.subtitle}
              </p>
            </div>

            {/* Property Details */}
            <CaseStudyDetails
              propertyValue={caseStudy.propertyValue}
              location={caseStudy.location}
            />

            {/* Challenge, What We Provided, Result, and Impact Sections */}
            <CaseStudyContent
              challenge={caseStudy.challenge}
              whatWeProvided={caseStudy.whatWeProvided}
              result={caseStudy.result}
              impact={caseStudy.impact}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
