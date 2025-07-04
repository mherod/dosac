import { CategoriesHeader } from "@/components/categories/categories-header";
import { CategoryCard } from "@/components/categories/category-card";
import { CATEGORIES } from "@/lib/categories";
import { formatPageTitle } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: formatPageTitle("Categories"),
  description: "Browse the ministerial archive by category",
};

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
