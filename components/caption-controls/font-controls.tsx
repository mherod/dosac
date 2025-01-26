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
  fontSize: number[];
  setFontSize: (value: number[]) => void;
  outlineWidth: number[];
  setOutlineWidth: (value: number[]) => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
}

export function FontControls({
  fontSize,
  setFontSize,
  outlineWidth,
  setOutlineWidth,
  fontFamily,
  setFontFamily,
}: FontControlsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Font Family</label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
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
    </div>
  );
}
