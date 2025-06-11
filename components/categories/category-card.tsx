import Link from "next/link";

type CategoryCardProps = {
  id: string;
  title: string;
  description: string;
};

export const CategoryCard = ({
  id,
  title,
  description,
}: CategoryCardProps): React.ReactElement => (
  <Link
    href={`/categories/${id}`}
    className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors hover:border-[#1d70b8]"
  >
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  </Link>
);
