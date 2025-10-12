import type React from "react";
import { Suspense } from "react";
import { CategoryNav } from "./main-nav/category-nav";
import { CivilServiceHeader } from "./main-nav/civil-service-header";
import { FeaturedCharacters } from "./main-nav/featured-characters";
import { NavFilters } from "./main-nav/nav-filters";
import { NavFiltersSkeleton } from "./main-nav/nav-filters-skeleton";
import { TopBanner } from "./main-nav/top-banner";

/**
 * Main navigation component for the application (server component)
 * Renders static header components and wraps interactive filters in Suspense
 * @returns The complete navigation bar with all controls and filters
 */
export function MainNav(): React.ReactElement {
  return (
    <header className="bg-[#0b0c0c] text-white">
      <div className="mx-auto max-w-7xl">
        <TopBanner />
        <CivilServiceHeader />
        <Suspense fallback={<NavFiltersSkeleton />}>
          <NavFilters>
            <FeaturedCharacters />
          </NavFilters>
        </Suspense>
        <CategoryNav />
      </div>
    </header>
  );
}
