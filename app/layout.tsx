import type { Metadata } from "next";

import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
