import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Thick of It Quotes",
    default: "Thick of It Quotes",
  },
  description: "Create and share memes from The Thick of It",
  metadataBase: new URL("https://dosac.herod.dev"),
  openGraph: {
    type: "website",
    siteName: "Thick of It Quotes",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    site: "@dosacquotes",
  },
  other: {
    "og:locale": "en_GB",
    "og:site_name": "Thick of It Quotes",
    "og:logo": "https://dosac.herod.dev/logo.svg",
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <div className="relative min-h-screen max-w-screen w-full overflow-x-hidden overflow-y-scroll flex flex-col">
            {children}
            <Image
              src="/dosac.png"
              alt="DoSAC"
              className="mx-auto p-4"
              width={130}
              height={50}
            />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
