"use client";

import { ReactNode } from "react";
import Sidebar from "./sidebar";
import MobileNavbar from "./sidebar/mobile-navbar";
import { SidebarProvider } from "./sidebar/sidebar-context";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden flex">
        <Sidebar />
        <main className="w-full overflow-y-auto scroll-smooth">
          <MobileNavbar />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
