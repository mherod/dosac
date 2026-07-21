import type { Metadata } from "next";
import { OfflinePage } from "@/components/offline-page";

export const metadata: Metadata = {
  title: "Offline",
  description: "The DOSAC.UK archive is unavailable while you are offline.",
  robots: { index: false, follow: false },
};

/**
 * Offline page component
 * Shown when the user is offline and no cached content is available
 */
export default function Offline(): React.ReactElement {
  return <OfflinePage />;
}
