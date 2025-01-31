import Link from "next/link";

type CategoryCardProps = {
  id: string;
  title: string;
  description: string;
};

export const CategoryCard = ({ id, title, description }: CategoryCardProps) => (
  <Link
    href={`/categories/${id}`}
    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:border-[#1d70b8] transition-colors"
  >
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  </Link>
);
