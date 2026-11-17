import type { Metadata } from "next";
import { Bebas_Neue, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-campaign",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "KIM SEONGYU | Nike Editorial Portfolio & Links",
  description: "Software Engineer & Builder — Precision Code and Digital Products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={cn("h-full", "antialiased", bebasNeue.variable, inter.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-white text-[#111111]">{children}</body>
    </html>
  );
}
