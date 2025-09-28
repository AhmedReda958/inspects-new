"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSidebar } from "./sidebar-context";

interface NavigationItem {
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { label: "ابدا الفحص اليوم", href: "#hero" },
  {
    label: "ما هي خدمة الفحص الهندسي؟",
    href: "#service-description",
  },
  {
    label: "لماذا الفحص مهم قبل شراء العقار؟",
    href: "#importance",
  },
  { label: "لماذا انسبكتكس؟", href: "#why-us" },
  {
    label: "محتويات الفحص الهندسي",
    href: "#inspection-contents",
  },
  {
    label: "آلية العمل في انسبكتكس",
    href: "#work-mechanism",
  },
  {
    label: "التقنيات والأجهزة المستخدمة",
    href: "#technologies",
  },
  {
    label: "المقارنة بين انسبكتكس والمنافسين",
    href: "#comparison",
  },
  { label: "دراسة الحالة", href: "#case-studies" },
  {
    label: "العملاء المميزون",
    href: "#featured-clients",
  },
  { label: "شهادات العملاء", href: "#testimonials" },
  {
    label: "الاطلاع على نموذج التقرير",
    href: "#report-sample",
  },
  { label: "الباقات", href: "#packages" },
  { label: "حاسبة الأسعار", href: "#price-calculator" },
  { label: "الاسئلة الشائعة", href: "#faq" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState<string>("");
  const { closeMobileSidebar } = useSidebar();

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems
        .filter((item) => item.href.startsWith("#"))
        .map((item) => ({
          id: item.href.substring(1),
          element: document.getElementById(item.href.substring(1)),
        }))
        .filter((section) => section.element);

      if (sections.length === 0) return;

      let currentActiveSection = "";

      // Find the section that is currently most visible in the viewport
      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          // A section is active if it's in the top half of the viewport
          if (rect.top <= window.innerHeight * 0.3 && rect.bottom > 0) {
            currentActiveSection = section.id;
          }
        }
      }

      // If no section found, default to the first one
      if (!currentActiveSection && sections.length > 0) {
        currentActiveSection = sections[0].id;
      }

      if (currentActiveSection && currentActiveSection !== activeSection) {
        setActiveSection(currentActiveSection);
      }
    };

    // Get the main scrollable element
    const mainElement = document.querySelector("main");

    // Set initial active section
    handleScroll();

    // Use throttling to improve performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    if (mainElement) {
      mainElement.addEventListener("scroll", throttledHandleScroll, {
        passive: true,
      });
    } else {
      window.addEventListener("scroll", throttledHandleScroll, {
        passive: true,
      });
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener("scroll", throttledHandleScroll);
      } else {
        window.removeEventListener("scroll", throttledHandleScroll);
      }
    };
  }, [activeSection]);

  return (
    <nav
      className="flex flex-col gap-3 flex-1 w-fit overflow-y-auto no-scrollbar"
      id="navigation"
    >
      {navigationItems.map((item, index) => {
        const sectionId = item.href.substring(1);
        const isActive = activeSection === sectionId;

        return (
          <Link
            key={index}
            href={item.href}
            onClick={() => closeMobileSidebar()}
            className={cn(
              "block w-full text-center lg:text-right text-sm lg:text-base font-medium tracking-none text-nowrap transition-colors",
              isActive ? "text-secondary" : "text-white/80 hover:text-secondary"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
