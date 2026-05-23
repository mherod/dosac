import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { MainNav } from "@/components/main-nav";
import { PWAInit } from "@/components/pwa-init";
import { PWAStatus } from "@/components/pwa-status";
import { PWAUpdateNotification } from "@/components/pwa-update-notification";
import { ThemeProvider } from "@/components/theme-provider";
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
  description:
    "Create and share memes from The Thick of It TV show. Browse thousands of iconic moments and create your own captions.",
  keywords: [
    "The Thick of It",
    "memes",
    "political satire",
    "comedy",
    "TV show",
    "quotes",
    "Malcolm Tucker",
    "British comedy",
    "Armando Iannucci",
    "Peter Capaldi",
  ],
  authors: [{ name: "DOSAC.UK" }],
  creator: "DOSAC.UK",
  publisher: "DOSAC.UK",
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
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    title: "The Thick of It Memes & Quotes",
    description:
      "Create and share memes from The Thick of It TV show. Browse thousands of iconic moments and create your own captions.",
    images: [
      {
        url: `${urlObject.origin}/og-homepage.jpg`,
        width: 1200,
        height: 630,
        alt: "The Thick of It Memes - Create and share memes from the iconic TV show",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Thick of It Memes & Quotes",
    description:
      "Create and share memes from The Thick of It TV show. Browse thousands of iconic moments and create your own captions.",
    images: [`${urlObject.origin}/og-homepage.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "3zDxylAILVG4stRVm15vY1iA9viFumha9D-SlU1jq50",
  },
  other: {
    "og:locale": "en_GB",
    "og:site_name": SITE_NAME,
    "og:logo": `${urlObject.origin}/logo.svg`,
    "format-detection": "telephone=no",
    "msapplication-TileColor": "#ffffff",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // viewport-fit=cover unlocks env(safe-area-inset-*) on iOS (notch,
  // Dynamic Island, home indicator). Without it every inset resolves to 0.
  viewportFit: "cover",
  // App is forced light theme; tint Safari chrome + PWA status bar to match.
  themeColor: "#ffffff",
  colorScheme: "light",
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
    <html
      lang="en"
      suppressHydrationWarning
      className="max-md:overflow-x-hidden"
    >
      <body
        className={`${inter.variable} font-sans antialiased max-md:overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:p-4 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Skip to main content
          </a>
          <Suspense>
            <MainNav />
          </Suspense>
          <main
            id="main-content"
            className="min-h-dvh pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
            tabIndex={-1}
          >
            {children}
          </main>
          <Footer />
          <Toaster />
          <PWAStatus />
          <PWAUpdateNotification />
          <PWAInit />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
