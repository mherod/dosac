import type React from "react";

interface AnimatedCaptionPageProps {
  children: React.ReactNode;
}

export function AnimatedCaptionPage({
  children,
}: AnimatedCaptionPageProps): React.ReactElement {
  return <div className="space-y-6">{children}</div>;
}

interface AnimatedFrameStripWrapperProps {
  children: React.ReactNode;
}

export function AnimatedFrameStripWrapper({
  children,
}: AnimatedFrameStripWrapperProps): React.ReactElement {
  return (
    <section className="space-y-3" aria-label="Frame selection">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-sm font-semibold">Nearby frames</h2>
        <p className="text-xs text-muted-foreground">
          Browse the strip to choose a frame to edit.
        </p>
      </div>
      {children}
    </section>
  );
}

interface AnimatedCaptionEditorWrapperProps {
  children: React.ReactNode;
}

export function AnimatedCaptionEditorWrapper({
  children,
}: AnimatedCaptionEditorWrapperProps): React.ReactElement {
  return <section aria-label="Caption editor">{children}</section>;
}
