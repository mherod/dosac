import * as React from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FontControls } from "@/components/caption-controls/font-controls";
import { ActionButtons } from "@/components/caption-controls/action-buttons";

interface EditorControlsCardProps {
  captions: string[];
  onCaptionChange: (index: number, value: string) => void;
  fontSize: number;
  setFontSize: (value: number) => void;
  outlineWidth: number;
  setOutlineWidth: (value: number) => void;
  shadowSize: number;
  setShadowSize: (value: number) => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
  onDownload: () => void;
  onShare: () => void;
  children?: React.ReactNode;
}

export function EditorControlsCard({
  captions,
  onCaptionChange,
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
}: EditorControlsCardProps) {
  return (
    <Card className="p-4 shadow-md w-full max-w-[400px]">
      <div className="space-y-4">
        {captions.map((caption, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between h-6">
              <label className="text-sm font-medium text-foreground leading-6">
                {captions.length > 1 ? `Frame ${index + 1} Caption` : "Caption"}
              </label>
              <span className="text-sm text-muted-foreground leading-6">
                {caption.length} characters
              </span>
            </div>
            <Textarea
              value={caption}
              onChange={(e) => onCaptionChange(index, e.target.value)}
              placeholder={
                captions.length > 1
                  ? `Enter caption for frame ${index + 1}...`
                  : "Enter your caption..."
              }
              className="min-h-[80px] resize-none transition-colors focus:border-primary"
            />
          </div>
        ))}

        {children}

        <div className="space-y-6 pt-6 border-t">
          <div className="h-6">
            <label className="text-sm font-medium text-foreground leading-6">
              Font Settings
            </label>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
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
