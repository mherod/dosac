import type React from "react";
import { HomePageShell } from "@/components/home-page-shell";
import { HomePageSkeleton } from "@/components/home-page-skeleton";

/** Returns the homepage shell while the route is loading. */
export default function Loading(): React.ReactElement {
  return (
    <HomePageShell>
      <HomePageSkeleton />
    </HomePageShell>
  );
}
