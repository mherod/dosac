import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}: FontControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="py-4">
        <div className="flex items-center justify-between h-6">
          <label className="text-sm font-medium text-foreground leading-6">
            Font Family
          </label>
        </div>
        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger className="mt-4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fonts.map((font) => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="py-4">
        <div className="flex items-center justify-between h-6">
          <label className="text-sm font-medium text-foreground leading-6">
            Font Size
          </label>
          <span className="text-sm text-muted-foreground leading-6">
            {fontSize}px
          </span>
        </div>
        <Slider
          value={[fontSize]}
          onValueChange={([value]) => setFontSize(value ?? 18)}
          min={16}
          max={36}
          step={1}
          className="mt-4"
        />
      </div>

      <div className="py-4">
        <div className="flex items-center justify-between h-6">
          <label className="text-sm font-medium text-foreground leading-6">
            Outline Width
          </label>
          <span className="text-sm text-muted-foreground leading-6">
            {outlineWidth}px
          </span>
        </div>
        <Slider
          value={[outlineWidth]}
          onValueChange={([value]) => setOutlineWidth(value ?? 1)}
          min={1}
          max={4}
          step={1}
          className="mt-4"
        />
      </div>

      <div className="py-4">
        <div className="flex items-center justify-between h-6">
          <label className="text-sm font-medium text-foreground leading-6">
            Shadow Size
          </label>
          <span className="text-sm text-muted-foreground leading-6">
            {shadowSize}px
          </span>
        </div>
        <Slider
          value={[shadowSize]}
          onValueChange={([value]) => setShadowSize(value ?? 1)}
          min={0}
          max={10}
          step={1}
          className="mt-4"
        />
      </div>
    </div>
  );
}
