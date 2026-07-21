import type { Metadata } from "next";
import { CategoriesHeader } from "@/components/categories/categories-header";
import { CategoryCard } from "@/components/categories/category-card";
import { CATEGORIES } from "@/lib/categories";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Quote Categories",
  description:
    "Browse The Thick of It quotes and meme frames by press office, policy and incident categories.",
  path: "/categories",
});

/**
 * Page component for displaying all available categories
 * Renders a grid of category cards with titles and descriptions
 * @returns The categories page with header and grid of category cards
 */
export default function CategoriesPage(): React.ReactElement {
  return (
    <main className="flex-1 bg-[#f3f2f1]">
      <CategoriesHeader />

      <div className="container py-8">
        <div className="grid gap-4">
          {CATEGORIES.map(
            (category: { id: string; title: string; description: string }) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                title={category.title}
                description={category.description}
              />
            ),
          )}
        </div>
      </div>
    </main>
  );
}
