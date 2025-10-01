"use client";

import Image from "next/image";
import { SocialLinks } from "./social-links";
import { Navigation } from "./navigation";
import { X } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const { isMobileOpen, closeMobileSidebar } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className=" fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={cn(
          "h-screen w-screen lg:w-[340px] bg-primary z-50",
          "lg:relative lg:translate-x-0",
          "fixed top-0 right-0 transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col justify-start items-center lg:items-start gap-6 p-6 px-8 bg-black/20">
          <button
            onClick={closeMobileSidebar}
            className="flex lg:hidden justify-center items-center bg-white/10 hover:bg-white/20 cursor-pointer size-11 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="إغلاق القائمة الجانبية"
          >
            <X className="size-8 text-secondary" />
          </button>
          <Image
            src="/logo-full-dark.svg"
            alt="logo"
            width={144}
            height={144}
            className="lg:w-36 lg:h-36 w-28 h-28 lg:-ms-4 lg:mb-4"
          />
          <Navigation />
          <SocialLinks />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
