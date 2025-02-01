import {
  ClientCaptionedImage,
  type CaptionedImageProps,
} from "./client-captioned-image";

export type { CaptionedImageProps };

/**
 * Server-side wrapper for the CaptionedImage component
 * Provides a simpler interface for using the component in server components
 * @param props - The component props (see CaptionedImageProps for details)
 * @returns The client-side captioned image component with the provided props
 */
export function CaptionedImage(props: CaptionedImageProps) {
  return <ClientCaptionedImage {...props} />;
}
