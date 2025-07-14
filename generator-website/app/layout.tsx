import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lebenshilfe Generator - Templates & Tools",
  description: "Generate customizable templates and tools for Lebenshilfe organizations",
  keywords: "lebenshilfe, generator, templates, tools, accessibility, support",
  authors: [{ name: "Claude Code" }, { name: "Ferdinand Koeppen" }],
  robots: "index, follow",
  openGraph: {
    title: "Lebenshilfe Generator - Templates & Tools",
    description: "Generate customizable templates and tools for Lebenshilfe organizations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
