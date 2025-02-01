import { type ReactNode } from "react";
import { PageContainer } from "@/components/layout/page-container";

interface SeriesLayoutProps {
  /** The content to render inside the layout */
  children: ReactNode;
}

/**
 * Layout component for series pages
 * Provides consistent container and spacing
 * @param props - Component props
 * @param props.children - The content to render inside the layout
 * @returns The series layout with consistent container and spacing
 */
export default function SeriesLayout({ children }: SeriesLayoutProps) {
  return <PageContainer>{children}</PageContainer>;
}
