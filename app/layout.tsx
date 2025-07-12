import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StackIt - Developer Q&A Platform",
  description: "A modern Q&A platform for developers. Ask questions, share knowledge, and build together.",
  keywords: ["Q&A", "developers", "programming", "questions", "answers", "community"],
  authors: [{ name: "StackIt Team" }],
  creator: "StackIt",
  publisher: "StackIt",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "StackIt - Developer Q&A Platform",
    description: "A modern Q&A platform for developers. Ask questions, share knowledge, and build together.",
    siteName: "StackIt",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackIt - Developer Q&A Platform",
    description: "A modern Q&A platform for developers. Ask questions, share knowledge, and build together.",
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
        <div className="dark">
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
