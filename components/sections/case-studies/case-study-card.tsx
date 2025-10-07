import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CaseStudyDetails } from "./case-study-details";
import { CaseStudyContent } from "./case-study-content";

interface CaseStudy {
  id: number;
  image: string;
  propertyValue: string;
  location: string;
  problem: string;
  story: {
    title: string;
    content: string;
  };
  whatWeProvided: {
    title: string;
    items: string[];
  };
  result: {
    title: string;
    content: string;
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
          <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh-100px)] overflow-hidden lg:order-last">
            <Image
              src={caseStudy.image}
              alt="Case Study"
              fill
              className="object-cover"
            />
          </div>

          {/* Content Section - 2/3 on desktop, full width on mobile */}
          <div className="lg:col-span-7 space-y-6">
            {/* Property Details */}
            <CaseStudyDetails
              propertyValue={caseStudy.propertyValue}
              location={caseStudy.location}
              problem={caseStudy.problem}
            />

            {/* Story, What We Provided, and Result Sections */}
            <CaseStudyContent
              story={caseStudy.story}
              whatWeProvided={caseStudy.whatWeProvided}
              result={caseStudy.result}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
