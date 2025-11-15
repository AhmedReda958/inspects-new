import Image from "next/image";
import { SocialLinks } from "@/components/pages/landing/layout/sidebar/social-links";

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto lg:px-22 py-16 flex flex-col items-center gap-8 pb-6">
        <Image
          src="/logo-full-dark.svg"
          alt="انسبكتكس"
          width={144}
          height={144}
          className="w-36 h-36 mx-auto"
        />

        <SocialLinks />

        {/* PDF Documents Links */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
          <a
            href="/QA-02-01 سياسة الحياد والسرية.pdf#toolbar=0&navpanes=0&scrollbar=1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-secondary transition-colors duration-200 text-sm lg:text-base font-medium underline underline-offset-4 hover:underline-offset-8"
            type="application/pdf"
          >
            سياسة الحياد والسرية
          </a>
          <a
            href="/QA-02-02 سياسة الجودة.pdf#toolbar=0&navpanes=0&scrollbar=1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-secondary transition-colors duration-200 text-sm lg:text-base font-medium underline underline-offset-4 hover:underline-offset-8"
            type="application/pdf"
          >
            سياسة الجودة
          </a>
        </div>

        <hr className="w-full  border-white/20" />

        <p className="text-center text-base lg:text-lg leading-tight font-medium text-white">
          جميع الحقوق محفوظة لموقع انسبكتكس 2025
        </p>
      </div>
    </footer>
  );
}
