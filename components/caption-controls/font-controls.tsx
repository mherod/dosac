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
  fontSize: number[];
  setFontSize: (value: number[]) => void;
  outlineWidth: number[];
  setOutlineWidth: (value: number[]) => void;
  shadowSize: number[];
  setShadowSize: (value: number[]) => void;
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
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Font Family</label>
        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger className="mt-2">
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

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Font Size</label>
          <span className="text-sm text-muted-foreground">{fontSize}px</span>
        </div>
        <Slider
          value={fontSize}
          onValueChange={setFontSize}
          min={16}
          max={36}
          step={1}
          className="py-2"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Outline Width</label>
          <span className="text-sm text-muted-foreground">
            {outlineWidth}px
          </span>
        </div>
        <Slider
          value={outlineWidth}
          onValueChange={setOutlineWidth}
          min={1}
          max={4}
          step={1}
          className="py-2"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Shadow Size</label>
          <span className="text-sm text-muted-foreground">{shadowSize}px</span>
        </div>
        <Slider
          value={shadowSize}
          onValueChange={setShadowSize}
          min={0}
          max={10}
          step={1}
          className="py-2"
        />
      </div>
    </div>
  );
}
