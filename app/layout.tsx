import type { Metadata } from "next";
import localFont from "next/font/local";
import content from "@/content";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";

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
  title: content.metadata.title,
  description: content.metadata.description,
  keywords: content.metadata.keywords,
  authors: [{ name: content.metadata.author }],
  robots: content.metadata.robots,
  category: content.metadata.category,
  classification: content.metadata.classification,

  appleWebApp: {
    title: content.metadata.title,
  },

  openGraph: {
    title: content.metadata.openGraph.title,
    description: content.metadata.openGraph.description,
    type: content.metadata.openGraph.type as "website",
    locale: content.metadata.openGraph.locale,
    siteName: content.metadata.openGraph.siteName,
    images: content.metadata.openGraph.images,
  },

  twitter: {
    card: content.metadata.twitter.card as "summary_large_image",
    title: content.metadata.twitter.title,
    description: content.metadata.twitter.description,
    images: content.metadata.twitter.images,
  },

  alternates: {
    canonical: content.metadata.canonical,
    languages: content.metadata.alternates.languages,
  },

  other: {
    "geo.region": content.metadata.geo.region,
    "geo.placename": content.metadata.geo.placename,
    "geo.position": content.metadata.geo.position,
    distribution: content.metadata.distribution,
    rating: content.metadata.rating,
    "revisit-after": content.metadata.revisit,
    expires: content.metadata.expires,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className={`${lamaSans.variable} antialiased`}>
        {children}
        <WhatsAppFloat phoneNumber="+966920005543" />
      </body>
    </html>
  );
}
