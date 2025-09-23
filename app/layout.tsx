import "./globals.css";
import { Footer } from "@/components/footer";
import { MainNav } from "@/components/main-nav";
import { ResourceHints } from "@/components/resource-hints";
import { ServiceWorkerRegistration } from "@/components/service-worker";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { WebVitalsReporter } from "@/components/web-vitals";
import { SITE_NAME } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap", // Optimize font loading with FOUT strategy
  preload: true, // Preload font files
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
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
      <head>
        <ResourceHints />
      </head>
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
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
        <ServiceWorkerRegistration />
        <WebVitalsReporter />
        <Analytics />
      </body>
    </html>
  );
}
