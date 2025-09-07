import { ActionButtons } from "@/components/caption-controls/action-buttons";
import { FontControls } from "@/components/caption-controls/font-controls";
import { Card } from "@/components/ui/card";

/**
 * Props for the EditorControlsCard component
 */
interface EditorControlsCardProps {
  /** Current font size in pixels */
  fontSize: number;
  /** Function to update font size */
  setFontSize: (value: number) => void;
  /** Current outline width in pixels */
  outlineWidth: number;
  /** Function to update outline width */
  setOutlineWidth: (value: number) => void;
  /** Current shadow size in pixels */
  shadowSize: number;
  /** Function to update shadow size */
  setShadowSize: (value: number) => void;
  /** Current font family name */
  fontFamily: string;
  /** Function to update font family */
  setFontFamily: (value: string) => void;
  /** Function to handle download action */
  onDownload: () => void;
  /** Function to handle share action */
  onShare: () => void;
  /** Optional child elements to render */
  children?: React.ReactNode;
}

/**
 * Card component containing controls for editing caption appearance
 * @param props - The component props
 * @param props.fontSize - Current font size in pixels
 * @param props.setFontSize - Function to update font size
 * @param props.outlineWidth - Current outline width in pixels
 * @param props.setOutlineWidth - Function to update outline width
 * @param props.shadowSize - Current shadow size in pixels
 * @param props.setShadowSize - Function to update shadow size
 * @param props.fontFamily - Current font family name
 * @param props.setFontFamily - Function to update font family
 * @param props.onDownload - Function to handle download action
 * @param props.onShare - Function to handle share action
 * @param props.children - Optional child elements to render
 * @returns A card containing font controls and action buttons
 */
export function EditorControlsCard({
  fontSize,
  setFontSize,
  outlineWidth,
  setOutlineWidth,
  shadowSize,
  setShadowSize,
  fontFamily,
  setFontFamily,
  onDownload,
  onShare,
  children,
}: EditorControlsCardProps): React.ReactElement {
  return (
    <Card
      className="w-full max-w-[400px] p-4 shadow-md"
      style={{ height: "max-content" }}
    >
      <div className="space-y-4">
        {children}

        <div className="space-y-6 border-t pt-6">
          <div className="h-6">
            <span className="text-sm font-medium leading-6 text-foreground">
              Font Settings
            </span>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <FontControls
              fontSize={fontSize}
              setFontSize={setFontSize}
              outlineWidth={outlineWidth}
              setOutlineWidth={setOutlineWidth}
              shadowSize={shadowSize}
              setShadowSize={setShadowSize}
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <ActionButtons onDownload={onDownload} onShare={onShare} />
        </div>
      </div>
    </Card>
  );
}
