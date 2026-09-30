import type React from "react";

/**
 * Stable homepage chrome shared by the streamed page and its loading route.
 * @param props - Streamed homepage content
 * @returns The homepage containers and persistent heading
 */
export function HomePageShell({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
      <div className="container mx-auto px-4 py-5 md:px-6 md:py-7 lg:px-8 lg:py-8">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          The Thick of It memes and quotes
        </h1>
        {children}
      </div>
    </div>
  );
}
