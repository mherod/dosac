"use client";

import { useEffect, useRef } from "react";

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  returnFocus?: boolean;
  initialFocus?: string;
}

/**
 * Focus trap component for modals and overlays
 * Keeps keyboard focus within the component
 */
export function FocusTrap({
  children,
  active = true,
  returnFocus = true,
  initialFocus,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Store the currently focused element
    if (returnFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Get all focusable elements
    const getFocusableElements = () => {
      if (!containerRef.current) return [];

      const selector = [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(",");

      return Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(selector),
      );
    };

    // Set initial focus
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      if (initialFocus) {
        const initialElement =
          containerRef.current.querySelector<HTMLElement>(initialFocus);
        initialElement?.focus();
      } else if (focusableElements[0]) {
        focusableElements[0].focus();
      }
    }

    // Handle tab key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !containerRef.current) return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (activeElement === firstElement && lastElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (activeElement === lastElement && firstElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Return focus to previous element
      if (returnFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, returnFocus, initialFocus]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} data-focus-trap="true">
      {children}
    </div>
  );
}
