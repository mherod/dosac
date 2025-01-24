import { CaptionEditor } from "./caption-editor";
import { getFrameById, getFrameIndex } from "@/lib/frames.server";
import { InvalidFrameIdError } from "@/lib/frames";
import { MainNav } from "@/components/main-nav";

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-2xl font-bold text-red-500">Error</h1>
      <p className="max-w-md text-muted-foreground">{message}</p>
      <div className="text-sm text-muted-foreground">
        <p>If this error persists:</p>
        <ul className="list-disc text-left pl-4 mt-2">
          <li>Check the URL format is correct</li>
          <li>Try refreshing the page</li>
          <li>Return home and select a different frame</li>
        </ul>
      </div>
      <a href="/" className="text-primary hover:underline">
        Return to Home
      </a>
    </div>
  );
}

export async function generateStaticParams() {
  const frames = await getFrameIndex();
  return frames.map((frame) => ({ id: frame.id }));
}

export default async function CaptionPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const screenshot = await getFrameById(params.id);
    return (
      <>
        <MainNav />
        <CaptionEditor screenshot={screenshot} />
      </>
    );
  } catch (error) {
    return (
      <>
        <MainNav />
        <ErrorMessage
          message={
            error instanceof InvalidFrameIdError
              ? error.message
              : "An unexpected error occurred."
          }
        />
      </>
    );
  }
}
