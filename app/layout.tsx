import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toast";
import { SITE_NAME } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const urlObject = new URL(url);

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description: "Create and share memes from The Thick of It",
  metadataBase: urlObject,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
  },
  other: {
    "og:locale": "en_GB",
    "og:site_name": SITE_NAME,
    "og:logo": `${urlObject.origin}/logo.svg`,
    "format-detection": "telephone=no",
  },
};

/**
 *
 * @param root0
 * @param root0.children
 * @returns
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <Suspense>
            <MainNav />
          </Suspense>
          <main className="min-h-screen min-">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
              {children}
            </div>
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
