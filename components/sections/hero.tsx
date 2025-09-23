import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-background " id="hero">
      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <div className="flex flex-col items-center gap-10 max-w-4xl text-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="Inspectex Logo"
              width={144}
              height={144}
              className="w-36 h-36"
              priority
            />
          </div>

          {/* Main Title - Arabic */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black text-primary leading-tight max-w-[1116px]"
            dir="rtl"
          >
            التقرير الاشمل و الادق فى المملكة العربية السعودية
          </h1>

          {/* Description - Arabic */}
          <p
            className="text-xl md:text-2xl lg:text-[28px] font-bold text-foreground leading-relaxed max-w-[658px]"
            dir="rtl"
          >
            حمينا مئات العملاء من خسائر بمئات الآلالف، كُن التالي ..
          </p>
        </div>
      </div>
    </div>
  );
}
