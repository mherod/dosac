"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type React from "react";

// Accessibility-aware animation hook
function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

interface AnimatedCaptionPageProps {
  children: React.ReactNode;
}

export function AnimatedCaptionPage({ children }: AnimatedCaptionPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // If user prefers reduced motion, skip animations
  if (prefersReducedMotion) {
    return <div className="space-y-8">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
            staggerChildren: 0.1,
          }}
          className="space-y-8"
          role="main"
          aria-label="Caption editing interface"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AnimatedFrameStripWrapperProps {
  children: React.ReactNode;
}

export function AnimatedFrameStripWrapper({
  children,
}: AnimatedFrameStripWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        className="flex items-center justify-center"
        role="region"
        aria-label="Frame selection"
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: -30 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: 30 }}
      transition={{
        duration: 0.4,
        delay: 0.1,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      }}
      className="flex items-center justify-center"
      role="region"
      aria-label="Frame selection"
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCaptionEditorWrapperProps {
  children: React.ReactNode;
}

export function AnimatedCaptionEditorWrapper({
  children,
}: AnimatedCaptionEditorWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div role="region" aria-label="Caption editor">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut",
        type: "spring",
        stiffness: 80,
      }}
      role="region"
      aria-label="Caption editor"
    >
      {children}
    </motion.div>
  );
}
