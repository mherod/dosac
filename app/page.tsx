"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScreenshotGrid } from "@/components/screenshot-grid";

export default function Home() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold">
          The Thick of It Screenshot Generator
        </h1>
        <p className="mb-6 text-lg text-muted-foreground">
          Search through every glorious insult and political catastrophe
        </p>
        <form className="relative mb-8">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search by quote, character, or episode..."
            className="pl-10 text-lg"
          />
          <Button type="submit" className="absolute right-1 top-1">
            Search
          </Button>
        </form>
      </div>

      <ScreenshotGrid />
    </div>
  );
}
