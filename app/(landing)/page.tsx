import HeroSection from "@/components/pages/landing/sections/hero";
import ServiceDescriptionSection from "@/components/pages/landing/sections/service-description";
import ProblemsGallerySection from "@/components/pages/landing/sections/problems-gallery";
import WhyImportantSection from "@/components/pages/landing/sections/why-important";
import WhyInspectexSection from "@/components/pages/landing/sections/why-inspectex";
import { Footer } from "@/components/pages/landing/sections/footer";
import InspectionContentsSection from "@/components/pages/landing/sections/inspection-contents";
import { WorkflowSection } from "@/components/pages/landing/sections/workflow";
import FaqSection from "@/components/pages/landing/sections/faq";
import TestimonialsSection from "@/components/pages/landing/sections/testimonials";
import FeaturedClients from "@/components/pages/landing/sections/featured-clients";
import TechnologiesSection from "@/components/pages/landing/sections/technologies";
import VideoSection from "@/components/pages/landing/sections/video-section";
import PackagesSection from "@/components/pages/landing/sections/packages";
import { ReportSampleSection } from "@/components/pages/landing/sections/report-sample";
import CalculatorSection from "@/components/pages/landing/sections/calculator";
import { Comparison } from "@/components/pages/landing/sections/comparison";
import { CaseStudies } from "@/components/pages/landing/sections/case-studies";

const Page = () => {
  return (
    <div>
      <HeroSection />
      <ServiceDescriptionSection />
      <ProblemsGallerySection />
      <WhyImportantSection />
      <WhyInspectexSection />
      <InspectionContentsSection />
      <WorkflowSection />
      <TechnologiesSection />
      <Comparison />
      <CaseStudies />
      <FeaturedClients />
      <TestimonialsSection />
      <ReportSampleSection />
      <PackagesSection />
      <VideoSection />
      <CalculatorSection />
      <FaqSection />
      <Footer />
    </div>
  );
};

export default Page;
