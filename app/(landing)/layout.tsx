"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/pages/landing/layout/sidebar";
import MobileNavbar from "@/components/pages/landing/layout/sidebar/mobile-navbar";
import { SidebarProvider } from "@/components/pages/landing/layout/sidebar/sidebar-context";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden flex" dir="rtl">
        <Sidebar />
        <main className="w-full overflow-y-auto scroll-smooth">
          <MobileNavbar />
          {children}
        </main>
      </div>
      <WhatsAppFloat phoneNumber="+966920005543" />
    </SidebarProvider>
  );
}

export default PageLayout;
