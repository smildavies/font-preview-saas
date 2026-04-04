import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CopyProtection from "@/components/CopyProtection";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Font Preview - Preview Your Fonts Online",
  description:
    "Instantly preview every font on your computer. Compare fonts side-by-side, explore glyphs, and export previews as PNG.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans select-none">
        <CopyProtection />
        {children}
      </body>
    </html>
  );
}
