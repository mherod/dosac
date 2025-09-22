import React, { forwardRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Input component with consistent styling
 * Extends native input element with additional styling and focus states
 * @param props - Component props including className and type
 * @param props.className - Additional CSS classes
 * @param props.type - Input type (text, password, etc.)
 * @returns A styled input element
 */
const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
