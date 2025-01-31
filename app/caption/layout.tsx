import Link from "next/link";

interface CaptionLayoutProps {
  children: React.ReactNode;
}

export default function CaptionLayout({ children }: CaptionLayoutProps) {
  return (
    <div className="container mx-auto px-2 md:px-4 py-8 max-w-[95vw] overflow-x-hidden">
      <Link
        href="/"
        className="mb-4 inline-block text-blue-500 hover:underline"
      >
        ← Back to search
      </Link>
      {children}
    </div>
  );
}
