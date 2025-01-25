import {
  ClientCaptionedImage,
  type CaptionedImageProps,
} from "./client-captioned-image";

export type { CaptionedImageProps };

export function CaptionedImage(props: CaptionedImageProps) {
  return <ClientCaptionedImage {...props} />;
}
