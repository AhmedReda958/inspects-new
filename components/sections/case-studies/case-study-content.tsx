import BrandBlueSquare from "@/icons/brand-blue-square.svg";

interface CaseStudySection {
  title: string;
  content?: string;
  items?: string[];
}

interface CaseStudyContentProps {
  story: CaseStudySection;
  whatWeProvided: CaseStudySection;
  result: CaseStudySection;
}

export function CaseStudyContent({
  story,
  whatWeProvided,
  result,
}: CaseStudyContentProps) {
  return (
    <div className="space-y-6">
      {/* Story Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BrandBlueSquare />
          <h3 className="text-primary">{story.title}</h3>
        </div>
        <p className="leading-loose">{story.content}</p>
      </div>

      {/* What We Provided Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BrandBlueSquare />
          <h3 className="text-primary">{whatWeProvided.title}</h3>
        </div>
        <ul className="space-y-2">
          {whatWeProvided.items?.map((item, index) => (
            <li
              key={index}
              className="text-foreground text-base flex items-start gap-2 leading-loose"
            >
              <span className="mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Result Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BrandBlueSquare />
          <h3 className="text-primary">{result.title}</h3>
        </div>
        <p className="leading-loose">{result.content}</p>
      </div>
    </div>
  );
}
