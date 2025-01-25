import { useState, useEffect } from "react";

export function useImageBounds(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setBounds({ width, height });
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    return () => window.removeEventListener("resize", updateBounds);
  }, [containerRef]);

  return bounds;
}
