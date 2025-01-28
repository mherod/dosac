import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
import { MainNav } from "@/components/main-nav";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const urlObject = new URL(url);

const title = "Thick of It Quotes";

export const metadata: Metadata = {
  title: {
    template: "%s | " + title,
    default: title,
  },
  description: "Create and share memes from The Thick of It",
  metadataBase: urlObject,
  openGraph: {
    type: "website",
    siteName: title,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
  },
  other: {
    "og:locale": "en_GB",
    "og:site_name": title,
    "og:logo": `${urlObject.origin}/logo.svg`,
    "format-detection": "telephone=no",
  },
};

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
          <main className="flex flex-col min-h-screen">
            <div className="flex-1 container max-w-6xl mx-auto px-4 md:px-6">
              {children}
            </div>

            <footer className="mt-auto border-t">
              <Image
                src="/DOSAC.png"
                alt="Department of Social Affairs and Citizenship logo"
                className="mx-auto py-4 w-32 md:w-40"
                width={160}
                height={64}
                priority
              />
            </footer>
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
