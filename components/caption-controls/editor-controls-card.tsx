import * as React from "react";
import { Card } from "@/components/ui/card";
import { FontControls } from "@/components/caption-controls/font-controls";
import { ActionButtons } from "@/components/caption-controls/action-buttons";

interface EditorControlsCardProps {
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
    <Card
      className="p-4 shadow-md w-full max-w-[400px]"
      style={{ height: "max-content" }}
    >
      <div className="space-y-4">
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
