"use client";

import { useState } from "react";
import { Search, Building2, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.slate.100),transparent)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.slate.900),transparent)]" />

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <a className="flex items-center space-x-2" href="/">
            <Building2 className="h-6 w-6" />
            <span className="font-bold">DoSaCGenerator</span>
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-12">
            <h1 className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-6xl font-black tracking-tight text-transparent dark:from-white dark:via-gray-200 dark:to-gray-400 sm:text-7xl">
              DoSaC Generator
            </h1>
          </div>
          <form className="group relative mb-12">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
            <Input
              name="search"
              placeholder="Search by quote, character, or episode..."
              className="h-14 rounded-2xl border-2 pl-12 pr-32 text-lg shadow-sm transition-shadow focus-visible:shadow-md"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-xl px-6 shadow-sm transition-all hover:shadow-md"
            >
              Search
            </Button>
          </form>
        </div>

        <div className="mx-auto max-w-[90rem] rounded-3xl border bg-card/50 p-4 sm:p-6 shadow-sm backdrop-blur-sm">
          <ScreenshotGrid />
        </div>
      </div>
    </div>
  );
}
