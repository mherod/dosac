import type { Metadata } from "next";
import { MainNav } from "@/components/main-nav";
import { FileText } from "lucide-react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Categories | DoSAC Digital Archive",
  description: "Browse the ministerial archive by category",
};

export default function CategoriesPage() {
  return (
    <>
      <MainNav />
      <main className="flex-1 bg-[#f3f2f1]">
        <div className="bg-[#1d70b8] text-white py-6">
          <div className="container">
            <div className="flex items-center gap-3">
              <div className="rounded bg-white/10 p-1">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Ministerial Archive Categories
                </h1>
                <p className="text-sm text-white/80">
                  Official categorisation of ministerial communications and
                  incidents
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:border-[#1d70b8] transition-colors"
              >
                <div className="px-6 py-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {category.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
