"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useSidebar } from "./sidebar-context";
import SidbarSquaresIcon from "@/icons/sidebar-square.svg";
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
    href: "#why-important",
  },
  { label: "لماذا إنسبكتكس؟", href: "#why-inspectex" },
  {
    label: "محتويات الفحص الهندسي",
    href: "#inspection-contents",
  },
  {
    label: "آلية العمل في إنسبكتكس",
    href: "#work-mechanism",
  },
  {
    label: "التقنيات والأجهزة المستخدمة",
    href: "#technologies",
  },
  {
    label: "المقارنة بين إنسبكتكس والمنافسين",
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
  { label: "حاسبة الأسعار", href: "#calculator" },
  { label: "الاسئلة الشائعة", href: "#faq" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState<string>("");
  const { closeMobileSidebar } = useSidebar();
  const activeSectionRef = useRef<string>("");

  useEffect(() => {
    // Add check to ensure we're on the client side
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const sections = navigationItems
        .filter((item) => item.href.startsWith("#"))
        .map((item) => ({
          id: item.href.substring(1),
          element: document.getElementById(item.href.substring(1)),
        }))
        .filter((section) => section.element);

      if (sections.length === 0) return;

      const viewportHeight = window.innerHeight;
      const viewportTop = 0;
      const viewportMiddle = viewportHeight * 0.3;

      let currentActiveSection = "";
      let maxVisibility = 0;

      // Find the section with the most visibility in the viewport
      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();

          // Calculate how much of the section is visible in the viewport
          const visibleTop = Math.max(rect.top, viewportTop);
          const visibleBottom = Math.min(rect.bottom, viewportHeight);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);

          // Prioritize sections near the top of the viewport
          // A section is more likely to be active if:
          // 1. Its top is above the middle threshold (30% from top)
          // 2. It has significant visibility
          if (rect.top <= viewportMiddle && rect.bottom > 0) {
            // Calculate a score based on visibility and position
            const positionScore =
              Math.max(0, viewportMiddle - rect.top) / viewportMiddle;
            const visibilityScore = visibleHeight / Math.max(rect.height, 1);
            const totalScore = positionScore * 0.6 + visibilityScore * 0.4;

            if (totalScore > maxVisibility) {
              maxVisibility = totalScore;
              currentActiveSection = section.id;
            }
          }
        }
      }

      // Only update if we found a valid section and it's different from current
      // Don't default to first section to avoid flickering
      if (
        currentActiveSection &&
        currentActiveSection !== activeSectionRef.current
      ) {
        activeSectionRef.current = currentActiveSection;
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
  }, []);

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
              "flex w-full text-center lg:text-right text-sm lg:text-base font-medium tracking-none text-nowrap transition-colors",
              isActive ? "text-secondary" : "text-white/80 hover:text-secondary"
            )}
          >
            {isActive && <SidbarSquaresIcon className="absolute start-0" />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
