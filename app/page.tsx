import HeroSection from "@/components/sections/hero";
import Sidebar from "@/components/layout/sidebar";

const Page = () => {
  return (
    <div className="h-screen bg-secondary overflow-hidden flex">
      <Sidebar />
      <main className="w-full overflow-auto">
        <HeroSection />
        <HeroSection />
        <HeroSection />
      </main>
    </div>
  );
};

export default Page;
