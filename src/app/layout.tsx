import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Yacht Club India | Private Luxury Yacht Charters in Goa",
  description: "Private luxury yacht charters in Goa with curated experiences on the Arabian Sea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakartaSans.variable} bg-[#F4F7FB] text-[#10233D] antialiased`}>
        <Header />
        {children}
        <Footer />
        <WhatsAppButton />
        <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
