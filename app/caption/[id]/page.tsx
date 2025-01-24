import fs from "fs";
import path from "path";
import { CaptionEditor } from "./caption-editor";

const getScreenshot = (id: string) => {
  const [season, episode, timestamp] = id.split("-");
  const framePath = path.join(
    process.cwd(),
    "public",
    "frames",
    season,
    timestamp,
    "frame.jpg",
  );

  if (!fs.existsSync(framePath)) {
    return null;
  }

  return {
    id,
    imageUrl: `/frames/${season}/${timestamp}/frame.jpg`,
    timestamp: `${season} - ${timestamp}`,
    subtitle: "Add your caption here",
    episode: `${season}`,
    character: "",
  };
};

export function generateStaticParams() {
  const frames: { id: string }[] = [];
  const seasonsDir = path.join(process.cwd(), "public", "frames");

  // Read all seasons
  const seasons = fs.readdirSync(seasonsDir);

  for (const season of seasons) {
    const seasonDir = path.join(seasonsDir, season);
    if (!fs.statSync(seasonDir).isDirectory()) continue;

    // Read all timestamps in the season
    const timestamps = fs.readdirSync(seasonDir);

    for (const timestamp of timestamps) {
      if (!fs.statSync(path.join(seasonDir, timestamp)).isDirectory()) continue;

      frames.push({
        id: `${season}-${timestamp}`,
      });
    }
  }

  return frames;
}

export default function CaptionPage({ params }: { params: { id: string } }) {
  const screenshot = getScreenshot(params.id);

  if (!screenshot) {
    return null;
  }

  return <CaptionEditor screenshot={screenshot} />;
}
