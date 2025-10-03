import Image from "next/image";
import { SocialLinks } from "@/components/layout/sidebar/social-links";

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto lg:px-22 py-16 flex flex-col items-center gap-8">
        <Image
          src="/logo-full-dark.svg"
          alt="انسبكتكس"
          width={144}
          height={144}
          className="w-36 h-36 mx-auto"
        />

        <SocialLinks />
        <hr className="w-full  border-white/20" />

        <p className="text-center text-base lg:text-lg leading-tight font-medium text-white">
          جميع الحقوق محفوظة لموقع انسبكتكس 2025
        </p>
      </div>
    </footer>
  );
}
