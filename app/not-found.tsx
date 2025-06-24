import Link from "next/link";

export const metadata = {
  title: "404 - Page Not Found",
};

/**
 * Page component for displaying 404 Not Found errors
 * Shows a friendly error message with a link to return home
 * Automatically redirects to home page after 5 seconds
 * @returns The 404 error page with message and home link
 */
export default function NotFound(): React.ReactElement {
  return (
    <>
      <meta httpEquiv="refresh" content="5;url=/" />
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-4 text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mb-4 text-lg text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          Redirecting to home page in 5 seconds...
        </p>
        <Link
          href="/"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Return Home
        </Link>
      </div>
    </>
  );
}
