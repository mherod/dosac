import type React from "react";

interface AnimatedCaptionPageProps {
  children: React.ReactNode;
}

export function AnimatedCaptionPage({
  children,
}: AnimatedCaptionPageProps): React.ReactElement {
  return <div className="space-y-8">{children}</div>;
}

interface AnimatedFrameStripWrapperProps {
  children: React.ReactNode;
}

export function AnimatedFrameStripWrapper({
  children,
}: AnimatedFrameStripWrapperProps): React.ReactElement {
  return (
    <section
      className="flex items-center justify-center"
      aria-label="Frame selection"
    >
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
