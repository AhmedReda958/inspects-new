import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="bg-background " id="hero">
      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center lg:min-h-screen min-h-[calc(100vh-86px)] px-4 py-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl">
          <Image
            src="/images/bg/hero-bg.png"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col items-center gap-10 max-w-4xl text-center -mt-20 lg:-mt-40">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/logo-full.svg"
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
            التقرير
            <span className="text-secondary">الاشمل و الادق</span> فى المملكة
            العربية السعودية
          </h1>

          {/* Description - Arabic */}
          <p
            className="text-xl md:text-2xl lg:text-[28px] font-bold text-foreground leading-relaxed max-w-[658px]"
            dir="rtl"
          >
            حمينا مئات العملاء من خسائر بمئات الآلالف، كُن التالي ..
          </p>
        </div>

        <Link
          href="#service-description"
          className=" absolute bottom-20 left-1/2 -translate-x-1/2 group "
          aria-label="Scroll to next section"
        >
          <div className="-rotate-45 flex flex-col items-center lg:w-[76px] lg:h-[76px] w-[44px] h-[44px] bg-secondary border-8 border-white outline outline-secondary/10  gap-3 p-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"></div>
          <ScrollIcon />
        </Link>
      </div>
    </div>
  );
}

const ScrollIcon = () => {
  return (
    <svg
      width={30}
      height={23}
      className=" group-hover:animate-bounce absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:size-14 size-[28px] "
      viewBox="0 0 30 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* First arrow - fastest animation */}
      <path
        className="animate-pulse group-hover:animate-none transition-all duration-500 group-hover:translate-y-1 group-hover:opacity-80"
        style={{ animationDelay: "0s" }}
        d="M15.0003 8.30688C14.394 8.30688 13.7877 8.07301 13.3286 7.61393L7.68107 1.96641C7.42988 1.71522 7.42988 1.29945 7.68107 1.04826C7.93226 0.797065 8.34803 0.797065 8.59923 1.04826L14.2467 6.69578C14.6625 7.11155 15.3381 7.11155 15.7539 6.69578L21.4014 1.04826C21.6526 0.797065 22.0684 0.797065 22.3196 1.04826C22.5708 1.29945 22.5708 1.71522 22.3196 1.96641L16.6721 7.61393C16.213 8.07301 15.6067 8.30688 15.0003 8.30688Z"
        fill="url(#paint0_linear_353_19741)"
      />
      {/* Second arrow - medium animation */}
      <path
        className="animate-pulse group-hover:animate-none transition-all duration-500 group-hover:translate-y-2 group-hover:opacity-90"
        style={{ animationDelay: "0.2s" }}
        d="M15.0004 13.9265C14.1304 13.9265 13.2605 13.591 12.6018 12.9323L4.49882 4.82936C4.13841 4.46895 4.13841 3.87241 4.49882 3.51201C4.85923 3.1516 5.45577 3.1516 5.81617 3.51201L13.9191 11.615C14.5157 12.2115 15.485 12.2115 16.0816 11.615L24.1845 3.51201C24.545 3.1516 25.1415 3.1516 25.5019 3.51201C25.8623 3.87241 25.8623 4.46895 25.5019 4.82936L17.3989 12.9323C16.7403 13.591 15.8703 13.9265 15.0004 13.9265Z"
        fill="url(#paint1_linear_353_19741)"
      />
      {/* Third arrow - slowest animation */}
      <path
        className="animate-pulse group-hover:animate-none transition-all duration-500 group-hover:translate-y-3 group-hover:opacity-100"
        style={{ animationDelay: "0.4s" }}
        d="M15.0002 22.78C13.867 22.78 12.7337 22.3429 11.8757 21.4848L1.32038 10.9295C0.85089 10.46 0.85089 9.68293 1.32038 9.21344C1.78986 8.74396 2.56694 8.74396 3.03643 9.21344L13.5918 19.7688C14.3688 20.5459 15.6316 20.5459 16.4087 19.7688L26.964 9.21344C27.4335 8.74396 28.2106 8.74396 28.6801 9.21344C29.1496 9.68293 29.1496 10.46 28.6801 10.9295L18.1247 21.4848C17.2667 22.3429 16.1335 22.78 15.0002 22.78Z"
        fill="url(#paint2_linear_353_19741)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_353_19741"
          x1="15.0003"
          y1="0.859863"
          x2="15.0003"
          y2="8.30688"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F25B06" />
          <stop offset={1} stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_353_19741"
          x1="15.0004"
          y1="3.2417"
          x2="15.0004"
          y2="13.9265"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F25B06" />
          <stop offset={1} stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_353_19741"
          x1="15.0002"
          y1="8.86133"
          x2="15.0002"
          y2="22.78"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F25B06" />
          <stop offset={1} stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
};
