import { VerticalFrameStrip } from "@/components/vertical-frame-strip";
import { Textarea } from "@/components/ui/textarea";

interface CaptionFrameControlsProps {
  imageUrls: string[];
  selectedImage?: string;
  onSelect: (imageUrl: string) => void;
  caption: string;
  onCaptionChange: (value: string) => void;
  label?: string;
  singleSelection?: boolean;
}

export function CaptionFrameControls({
  imageUrls,
  selectedImage,
  onSelect,
  caption,
  onCaptionChange,
  label = "Frame",
  singleSelection = true,
}: CaptionFrameControlsProps) {
  const [firstFrameImageUrl, secondFrameImageUrl] = imageUrls.filter(Boolean);
  if (!firstFrameImageUrl || !secondFrameImageUrl) {
    return null;
  }

  return (
    <div className="space-y-4 flex flex-col gap-2">
      <div className="h-fit flex flex-row items-baseline justify-between p-0 absolute z-10 gap-3 mb-2">
        <label className="text-sm font-medium text-foreground leading-6">
          {label}
        </label>
      </div>

      <div className="flex p-2 h-fit">
        <div className="flex-1 h-full">
          <Textarea
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            placeholder={`Enter caption for ${label.toLowerCase()}...`}
            className="min-h-[125px] h-full resize-none transition-colors focus:border-primary rounded-r-none p-4 text-sm flex items-center"
          />
        </div>

        <VerticalFrameStrip
          imageUrls={[firstFrameImageUrl, secondFrameImageUrl]}
          selectedImage={selectedImage}
          frameWidth={100}
          onFrameSelect={onSelect}
          singleSelection={singleSelection}
        />
      </div>
    </div>
  );
}
