import { Suspense } from "react";

/**
 * Loading skeleton for navigation components
 */
function NavSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-full rounded bg-gray-200" />
    </div>
  );
}

/**
 * Suspense wrapper for navigation components with loading fallback
 */
export function NavSuspenseWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<NavSkeleton />}>{children}</Suspense>;
}
