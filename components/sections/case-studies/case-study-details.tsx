interface CaseStudyDetailsProps {
  propertyValue: string;
  location: string;
}

export function CaseStudyDetails({
  propertyValue,
  location,
}: CaseStudyDetailsProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-8 bg-background p-10 text-center *:space-y-2 *:pb-4 *:border-b *:lg:border-b-0 *:w-fit *:lg:text-start mb-10">
      <div className="lg:border-l-1 lg:pl-4">
        <h3 className="lg:text-base font-bold text-primary">قيمة العقار</h3>
        <p className="lg:text-sm font-medium">{propertyValue}</p>
      </div>
      <div>
        <h3 className="lg:text-base font-bold text-primary">الموقع</h3>
        <p className="lg:text-sm">{location}</p>
      </div>
    </div>
  );
}
