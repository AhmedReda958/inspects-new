import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import content from "@/content";
import { Toaster } from "@/components/ui/toaster";

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
  metadataBase: new URL("https://inspectex.sa"),
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
    "facebook-domain-verification": "hxk48vt5nisdvhgj3qd3d4d18sugln",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" className="scroll-smooth">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WX6M8YY0CY"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WX6M8YY0CY');
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
							(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
							new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
							j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
							'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
							})(window,document,'script','dataLayer','GTM-TV3DMFJZ');
						`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${lamaSans.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TV3DMFJZ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {children}
        <Toaster />
      </body>
    </html>
  );
}
