import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const lamaSans = localFont({
  src: [
    {
      path: "/fonts/LamaSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "/fonts/LamaSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "/fonts/LamaSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-lama-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inspectex",
  description: "Inspectex",
  appleWebApp: {
    title: "Inspectex",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className={`${lamaSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
