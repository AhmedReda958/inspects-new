"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";

const MobileNavbar = () => {
  const { toggleMobileSidebar } = useSidebar();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Get the main scrollable element
    const mainElement = document.querySelector("main");

    const handleScroll = () => {
      const scrollTop = mainElement
        ? mainElement.scrollTop
        : window.scrollY || document.documentElement.scrollTop;

      // Show new design from the beginning of scroll
      setIsScrolled(scrollTop > 0);
    };

    // Set initial state
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
    <div
      className={cn(
        "block lg:hidden h-[86px] bg-white transition-all duration-300 sticky top-0 z-40",
        isScrolled && "shadow-md h-[70px]"
      )}
    >
      {isScrolled ? (
        // Scrolled design: Logo on left, sidebar button on right
        <div className="h-full flex items-center justify-between px-4">
          <button
            onClick={toggleMobileSidebar}
            className="size-11 bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            aria-label="فتح القائمة الجانبية"
          >
            <svg
              width={24}
              height={25}
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 6.06982H3C2.59 6.06982 2.25 5.72982 2.25 5.31982C2.25 4.90982 2.59 4.56982 3 4.56982H21C21.41 4.56982 21.75 4.90982 21.75 5.31982C21.75 5.72982 21.41 6.06982 21 6.06982Z"
                fill="white"
              />
              <path
                d="M16.7398 11.0698H7.25977C6.84977 11.0698 6.50977 10.7298 6.50977 10.3198C6.50977 9.90982 6.84977 9.56982 7.25977 9.56982H16.7298C17.1398 9.56982 17.4798 9.90982 17.4798 10.3198C17.4798 10.7298 17.1498 11.0698 16.7398 11.0698Z"
                fill="white"
              />
              <path
                d="M21 16.0698H3C2.59 16.0698 2.25 15.7298 2.25 15.3198C2.25 14.9098 2.59 14.5698 3 14.5698H21C21.41 14.5698 21.75 14.9098 21.75 15.3198C21.75 15.7298 21.41 16.0698 21 16.0698Z"
                fill="white"
              />
              <path
                d="M16.7398 21.0698H7.25977C6.84977 21.0698 6.50977 20.7298 6.50977 20.3198C6.50977 19.9098 6.84977 19.5698 7.25977 19.5698H16.7298C17.1398 19.5698 17.4798 19.9098 17.4798 20.3198C17.4798 20.7298 17.1498 21.0698 16.7398 21.0698Z"
                fill="white"
              />
            </svg>
          </button>
          <div className="flex-shrink-0">
            <Image
              src="/logo-full.svg"
              alt="Inspectex Logo"
              width={140}
              height={140}
              className="h-12 w-auto"
              priority
            />
          </div>
        </div>
      ) : (
        // Hero design: Original centered button with text
        <>
          <button
            onClick={toggleMobileSidebar}
            className="absolute z-20 top-full left-1/2 -translate-x-1/2 -translate-y-1/2 size-11 bg-primary flex items-center justify-center -rotate-45 hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            aria-label="فتح القائمة الجانبية"
          >
            <svg
              width={24}
              height={25}
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rotate-45"
            >
              <path
                d="M21 6.06982H3C2.59 6.06982 2.25 5.72982 2.25 5.31982C2.25 4.90982 2.59 4.56982 3 4.56982H21C21.41 4.56982 21.75 4.90982 21.75 5.31982C21.75 5.72982 21.41 6.06982 21 6.06982Z"
                fill="white"
              />
              <path
                d="M16.7398 11.0698H7.25977C6.84977 11.0698 6.50977 10.7298 6.50977 10.3198C6.50977 9.90982 6.84977 9.56982 7.25977 9.56982H16.7298C17.1398 9.56982 17.4798 9.90982 17.4798 10.3198C17.4798 10.7298 17.1498 11.0698 16.7398 11.0698Z"
                fill="white"
              />
              <path
                d="M21 16.0698H3C2.59 16.0698 2.25 15.7298 2.25 15.3198C2.25 14.9098 2.59 14.5698 3 14.5698H21C21.41 14.5698 21.75 14.9098 21.75 15.3198C21.75 15.7298 21.41 16.0698 21 16.0698Z"
                fill="white"
              />
              <path
                d="M16.7398 21.0698H7.25977C6.84977 21.0698 6.50977 20.7298 6.50977 20.3198C6.50977 19.9098 6.84977 19.5698 7.25977 19.5698H16.7298C17.1398 19.5698 17.4798 19.9098 17.4798 20.3198C17.4798 20.7298 17.1498 21.0698 16.7398 21.0698Z"
                fill="white"
              />
            </svg>
          </button>
          <span className="text-black text-xl font-bold absolute top-full left-1/2 -translate-x-1/2 translate-y-10">
            جدول المحتويات
          </span>
        </>
      )}
    </div>
  );
};

export default MobileNavbar;
