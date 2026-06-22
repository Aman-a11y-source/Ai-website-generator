import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kairo AI - Next-Gen AI Website Builder",
  description: "Generate, edit, and explore stunning designs with AI. Export to production-ready React, Next.js, and HTML code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${plusJakartaSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased scroll-smooth`}
      >
        <body className="h-full bg-background text-foreground selection:bg-indigo-500/30 selection:text-indigo-200">
         <Provider>{children}</Provider> 
         <Toaster position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}

