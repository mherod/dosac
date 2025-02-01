"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

/**
 * Props for the TextInput component
 * Extends native input element props with additional features
 */
export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional label text to display above the input */
  label?: string;
  /** Optional error message to display below the input */
  error?: string;
  /** Optional description text to display below the input */
  description?: string;
}

/**
 * Enhanced text input component with label, error, and description support
 * Wraps the base Input component with additional functionality
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.label - Label text to display above the input
 * @param props.error - Error message to display below the input
 * @param props.description - Description text to display below the input
 * @param props.id - Optional ID for the input (auto-generated if not provided)
 * @returns A styled input component with optional label, error, and description
 */
const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, label, error, description, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="grid w-full gap-1.5">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <Input
          id={inputId}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          aria-describedby={
            error
              ? `${inputId}-error`
              : description
                ? `${inputId}-description`
                : undefined
          }
          {...props}
          ref={ref}
        />
        {error && (
          <p
            className="text-sm font-medium text-destructive"
            id={`${inputId}-error`}
          >
            {error}
          </p>
        )}
        {!error && description && (
          <p
            className="text-sm text-muted-foreground"
            id={`${inputId}-description`}
          >
            {description}
          </p>
        )}
      </div>
    );
  },
);
TextInput.displayName = "TextInput";

export { TextInput };
