import HeroSection from "@/components/sections/hero";
import Sidebar from "@/components/layout/sidebar";
import MobileNavbar from "@/components/layout/sidebar/mobile-navbar";

const Page = () => {
  return (
    <div className="h-screen overflow-hidden flex">
      <Sidebar />
      <main className="w-full overflow-y-auto scroll-smooth">
        <MobileNavbar />
        <HeroSection />
        <section
          id="service-description"
          className="min-h-screen bg-blue-100 flex items-center justify-center"
        >
          <h2 className="text-4xl font-bold text-primary">
            ما هي خدمة الفحص الهندسي؟
          </h2>
        </section>
        <section
          id="importance"
          className="min-h-screen bg-green-100 flex items-center justify-center"
        >
          <h2 className="text-4xl font-bold text-primary">
            لماذا الفحص مهم قبل شراء العقار؟
          </h2>
        </section>
        <section
          id="why-us"
          className="min-h-screen bg-yellow-100 flex items-center justify-center"
        >
          <h2 className="text-4xl font-bold text-primary">لماذا انسبكتكس؟</h2>
        </section>
        <section
          id="inspection-contents"
          className="min-h-screen bg-red-100 flex items-center justify-center"
        >
          <h2 className="text-4xl font-bold text-primary">
            محتويات الفحص الهندسي
          </h2>
        </section>
        <section
          id="work-mechanism"
          className="min-h-screen bg-purple-100 flex items-center justify-center"
        >
          <h2 className="text-4xl font-bold text-primary">
            آلية العمل في انسبكتكس
          </h2>
        </section>
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
          <h2 className="text-4xl font-bold text-primary">العملاء المميزون</h2>
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
        <section
          id="faq"
          className="min-h-screen bg-slate-100 flex items-center justify-center"
        >
          <h2 className="text-4xl font-bold text-primary">الاسئلة الشائعة</h2>
        </section>
      </main>
    </div>
  );
};

export default Page;
