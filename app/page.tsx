import { getFrameIndex } from "@/lib/frames.server";
import { HomePage } from "@/components/home-page";

export default async function Home() {
  const screenshots = await getFrameIndex();
  return <HomePage screenshots={screenshots} />;
}
