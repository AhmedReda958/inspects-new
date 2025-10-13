import HeroSection from "@/components/sections/hero";
import ServiceDescriptionSection from "@/components/sections/service-description";
import ProblemsGallerySection from "@/components/sections/problems-gallery";
import WhyImportantSection from "@/components/sections/why-important";
import WhyInspectexSection from "@/components/sections/why-inspectex";
import Sidebar from "@/components/layout/sidebar";
import MobileNavbar from "@/components/layout/sidebar/mobile-navbar";
import { Footer } from "@/components/sections/footer";
import InspectionContentsSection from "@/components/sections/inspection-contents";
import { WorkflowSection } from "@/components/sections/workflow";
import FaqSection from "@/components/sections/faq";
import TestimonialsSection from "@/components/sections/testimonials";
import FeaturedClients from "@/components/sections/featured-clients";
import TechnologiesSection from "@/components/sections/technologies";
import VideoSection from "@/components/sections/video-section";
import PackagesSection from "@/components/sections/packages";
import { ReportSampleSection } from "@/components/sections/report-sample";
import CalculatorSection from "@/components/sections/calculator";
import { Comparison } from "@/components/sections/comparison";
import { CaseStudies } from "@/components/sections/case-studies";

const Page = () => {
  return (
    <div className="h-screen overflow-hidden flex">
      <Sidebar />
      <main className="w-full overflow-y-auto scroll-smooth">
        <MobileNavbar />
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
      </main>
    </div>
  );
};

export default Page;
