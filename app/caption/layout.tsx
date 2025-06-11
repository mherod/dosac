import React from "react";
import { type ReactNode } from "react";
import { PageContainer } from "@/components/layout/page-container";

interface CaptionLayoutProps {
  /** The content to render inside the layout */
  children: ReactNode;
}

/**
 * Layout component for caption pages
 * Provides consistent container and spacing
 * @param props - Component props
 * @param props.children - The content to render inside the layout
 * @returns The caption layout with consistent container and spacing
 */
export default function CaptionLayout({
  children,
}: CaptionLayoutProps): React.ReactElement {
  return <PageContainer>{children}</PageContainer>;
}
