import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/categories";
import { CategoriesHeader } from "@/components/categories/categories-header";
import { CategoryCard } from "@/components/categories/category-card";

export const metadata: Metadata = {
  title: "Categories | DoSAC Digital Archive",
  description: "Browse the ministerial archive by category",
};

export default function CategoriesPage() {
  return (
    <main className="flex-1 bg-[#f3f2f1]">
      <CategoriesHeader />

      <div className="container py-8">
        <div className="grid gap-4">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              title={category.title}
              description={category.description}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
