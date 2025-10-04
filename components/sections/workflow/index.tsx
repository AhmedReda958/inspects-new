import { SectionTitle } from "@/components/ui/section-title";
import { WorkflowStepCard } from "@/components/sections/workflow/workflow-step-card";
import content from "@/content";

export function WorkflowSection() {
  return (
    <section className="py-20 lg:py-32 min-h-screen bg-background">
      <div className="container">
        <SectionTitle variant="center">{content.workflow.title}</SectionTitle>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {content.workflow.steps.map((step, index) => (
            <WorkflowStepCard
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
