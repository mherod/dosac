"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
}

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
