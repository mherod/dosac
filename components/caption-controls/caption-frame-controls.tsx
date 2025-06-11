import { VerticalFrameStrip } from "@/components/vertical-frame-strip";
import { Textarea } from "@/components/ui/textarea";

/**
 * Props for the CaptionFrameControls component
 */
interface CaptionFrameControlsProps {
  /** Array of image URLs to display in the frame strip */
  imageUrls: string[];
  /** Currently selected image URL */
  selectedImage?: string;
  /** Callback function when an image is selected */
  onSelect: (imageUrl: string) => void;
  /** Current caption text */
  caption: string;
  /** Callback function when caption text changes */
  onCaptionChange: (value: string) => void;
  /** Label for the frame selection (defaults to "Frame") */
  label?: string;
  /** Whether only one frame can be selected at a time (defaults to true) */
  singleSelection?: boolean;
}

/**
 * Component that provides controls for selecting frames and editing captions
 * @param props - The component props
 * @param props.imageUrls - Array of image URLs to display in the frame strip
 * @param props.selectedImage - Currently selected image URL
 * @param props.onSelect - Callback function when an image is selected
 * @param props.caption - Current caption text
 * @param props.onCaptionChange - Callback function when caption text changes
 * @param props.label - Label for the frame selection (defaults to "Frame")
 * @param props.singleSelection - Whether only one frame can be selected at a time
 * @returns A control panel for frame selection and caption editing
 */
export function CaptionFrameControls({
  imageUrls,
  selectedImage,
  onSelect,
  caption,
  onCaptionChange,
  label = "Frame",
  singleSelection = true,
}: CaptionFrameControlsProps): React.ReactElement | null {
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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onCaptionChange(e.target.value)
            }
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
