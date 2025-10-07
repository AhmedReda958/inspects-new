import HeroSection from "@/components/sections/hero";
import ServiceDescriptionSection from "@/components/sections/service-description";
import ProblemsGallerySection from "@/components/sections/problems-gallery";
import WhyImportantSection from "@/components/sections/why-important";
import WhyInspectexSection from "@/components/sections/why-inspectex";
import Sidebar from "@/components/layout/sidebar";
import MobileNavbar from "@/components/layout/sidebar/mobile-navbar";
import { SidebarProvider } from "@/components/layout/sidebar/sidebar-context";
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

const Page = () => {
  return (
    <SidebarProvider>
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
          <section
            id="comparison"
            className="min-h-screen bg-indigo-100 flex items-center justify-center"
          >
            <h2 className="text-4xl font-bold text-primary">
              المقارنة بين انسبكتكس والمنافسين
            </h2>
          </section>
          <section
            id="case-studies"
            className="min-h-screen bg-gray-100 flex items-center justify-center"
          >
            <h2 className="text-4xl font-bold text-primary">دراسة الحالة</h2>
          </section>
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
    </SidebarProvider>
  );
};

export default Page;
