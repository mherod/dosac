"use client";

import type React from "react";
import { forwardRef, useState } from "react";

import { cn } from "@/lib/utils";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => {
  const { className, onChange, value, ...rest } = props;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const displayValue = isControlled ? String(value) : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="relative">
      <textarea
        className={cn(
          // Keep 16px in landscape and on iPad too, to avoid Safari focus zoom.
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onChange={handleChange}
        value={displayValue}
        ref={ref}
        {...rest}
      />
      <div className="absolute bottom-1 left-1 text-xs text-muted-foreground">
        {displayValue.length} characters
      </div>
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
