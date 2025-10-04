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
          <section
            id="technologies"
            className="min-h-screen bg-pink-100 flex items-center justify-center"
          >
            <h2 className="text-4xl font-bold text-primary">
              التقنيات والأجهزة المستخدمة
            </h2>
          </section>
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
          <section
            id="featured-clients"
            className="min-h-screen bg-orange-100 flex items-center justify-center"
          >
            <h2 className="text-4xl font-bold text-primary">
              العملاء المميزون
            </h2>
          </section>
          <section
            id="testimonials"
            className="min-h-screen bg-teal-100 flex items-center justify-center"
          >
            <h2 className="text-4xl font-bold text-primary">شهادات العملاء</h2>
          </section>
          <section
            id="report-sample"
            className="min-h-screen bg-cyan-100 flex items-center justify-center"
          >
            <h2 className="text-4xl font-bold text-primary">
              الاطلاع على نموذج التقرير
            </h2>
          </section>
          <section
            id="packages"
            className="min-h-screen bg-lime-100 flex items-center justify-center"
          >
            <h2 className="text-4xl font-bold text-primary">الباقات</h2>
          </section>
          <section
            id="price-calculator"
            className="min-h-screen bg-emerald-100 flex items-center justify-center"
          >
            <h2 className="text-4xl font-bold text-primary">حاسبة الأسعار</h2>
          </section>
          <FaqSection />
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Page;
