/**
 * Skip link component for keyboard navigation
 * Allows users to skip repetitive navigation
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
