"use client";

import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const fonts = [
  "Arial",
  "Impact",
  "Helvetica",
  "Verdana",
  "Times New Roman",
  "Comic Sans MS",
];

interface FontControlsProps {
  fontSize: number;
  setFontSize: (value: number) => void;
  outlineWidth: number;
  setOutlineWidth: (value: number) => void;
  shadowSize: number;
  setShadowSize: (value: number) => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
}

export function FontControls({
  fontSize,
  setFontSize,
  outlineWidth,
  setOutlineWidth,
  shadowSize,
  setShadowSize,
  fontFamily,
  setFontFamily,
}: FontControlsProps): React.ReactElement {
  const controlId = useId();
  return (
    <div className="flex flex-col gap-4">
      <div className="p-0">
        <div className="flex h-6 items-center justify-between">
          <label
            htmlFor={`${controlId}-font`}
            className="text-sm font-medium leading-6 text-foreground"
          >
            Font
          </label>
        </div>
        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger
            id={`${controlId}-font`}
            className="mt-2 h-11 border-input bg-background text-foreground hover:bg-muted focus:ring-ring md:h-11"
          >
            <SelectValue style={{ fontFamily: fontFamily }} />
          </SelectTrigger>
          <SelectContent>
            {fonts.map((font: string) => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex h-6 items-center justify-between">
          <span
            id={`${controlId}-size`}
            className="text-sm font-medium leading-6 text-foreground"
          >
            Font Size
          </span>
          <span className="text-sm tabular-nums leading-6 text-muted-foreground">
            {fontSize}px
          </span>
        </div>
        <Slider
          aria-labelledby={`${controlId}-size`}
          aria-valuetext={`${fontSize} pixels`}
          value={[fontSize]}
          onValueChange={([value]: number[]) => setFontSize(value ?? 18)}
          min={16}
          max={36}
          step={1}
          className="min-h-8"
        />
      </div>

      <div>
        <div className="flex h-6 items-center justify-between">
          <span
            id={`${controlId}-outline`}
            className="text-sm font-medium leading-6 text-foreground"
          >
            Outline Width
          </span>
          <span className="text-sm tabular-nums leading-6 text-muted-foreground">
            {outlineWidth}px
          </span>
        </div>
        <Slider
          aria-labelledby={`${controlId}-outline`}
          aria-valuetext={`${outlineWidth} pixels`}
          value={[outlineWidth]}
          onValueChange={([value]: number[]) => setOutlineWidth(value ?? 1)}
          min={1}
          max={4}
          step={1}
          className="min-h-8"
        />
      </div>

      <div>
        <div className="flex h-6 items-center justify-between">
          <span
            id={`${controlId}-shadow`}
            className="text-sm font-medium leading-6 text-foreground"
          >
            Shadow Size
          </span>
          <span className="text-sm tabular-nums leading-6 text-muted-foreground">
            {shadowSize}px
          </span>
        </div>
        <Slider
          aria-labelledby={`${controlId}-shadow`}
          aria-valuetext={`${shadowSize} pixels`}
          value={[shadowSize]}
          onValueChange={([value]: number[]) => setShadowSize(value ?? 1)}
          min={0}
          max={10}
          step={1}
          className="min-h-8"
        />
      </div>
    </div>
  );
}
