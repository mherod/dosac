import "./globals.css";
import { Footer } from "@/components/footer";
import { MainNav } from "@/components/main-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { SITE_NAME } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Suspense } from "react";

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
    "google-site-verification": "3zDxylAILVG4stRVm15vY1iA9viFumha9D-SlU1jq50",
  },
};

/**
 * Root layout component for the application
 * @param props - The layout props
 * @param props.children - The child components to render
 * @returns The root layout element
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <Suspense>
            <MainNav />
          </Suspense>
          <main className="min- min-h-screen">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
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
