import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";

const MAX_SIZE_MB = 100;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface SizeInfo {
  path: string;
  size: number;
  isDirectory: boolean;
}

const EXCLUDED_EXTENSIONS = [".mp4"];

function shouldIncludeFile(path: string): boolean {
  return !EXCLUDED_EXTENSIONS.some((ext) => path.toLowerCase().endsWith(ext));
}

async function getDirectoryContents(directory: string): Promise<SizeInfo[]> {
  const results: SizeInfo[] = [];
  const files = await readdir(directory, { withFileTypes: true });

  for (const file of files) {
    const path = join(directory, file.name);

    if (file.isDirectory()) {
      const subDirContents = await getDirectoryContents(path);
      // Only count files that aren't excluded
      const totalSize = subDirContents
        .filter(
          (item: any) => !item.isDirectory && shouldIncludeFile(item.path),
        )
        .reduce((sum, item) => sum + item.size, 0);
      results.push({ path, size: totalSize, isDirectory: true });
      results.push(...subDirContents);
    } else if (shouldIncludeFile(path)) {
      const stats = await stat(path);
      results.push({ path, size: stats.size, isDirectory: false });
    }
  }

  return results;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
}

function formatPath(path: string): string {
  return path.replace(process.cwd(), "");
}

async function main() {
  try {
    const publicDir = join(process.cwd(), "public");
    const contents = await getDirectoryContents(publicDir);
    const totalSize = contents
      .filter((item: any) => !item.isDirectory && shouldIncludeFile(item.path))
      .reduce((sum, item) => sum + item.size, 0);

    console.log(
      chalk.blue(
        `\nTotal public directory size (excluding .mp4 files): ${formatSize(totalSize)}`,
      ),
    );

    // Top 10 largest directories (excluding mp4s)
    const directories = contents
      .filter((item: any) => item.isDirectory)
      .sort((a: any, b: any) => b.size - a.size)
      .slice(0, 10);

    console.log(chalk.yellow("\nTop 10 largest directories:"));
    directories.forEach((dir) => {
      console.log(
        `${chalk.dim(formatPath(dir.path))}: ${formatSize(dir.size)}`,
      );
    });

    // Top 20 largest files (excluding mp4s)
    const files = contents
      .filter((item: any) => !item.isDirectory && shouldIncludeFile(item.path))
      .sort((a: any, b: any) => b.size - a.size)
      .slice(0, 20);

    console.log(chalk.yellow("\nTop 20 largest files:"));
    files.forEach((file) => {
      console.log(
        `${chalk.dim(formatPath(file.path))}: ${formatSize(file.size)}`,
      );
    });

    if (totalSize > MAX_SIZE_BYTES) {
      console.log(
        chalk.red(
          `\n⚠️  Warning: Public directory exceeds ${MAX_SIZE_MB}MB limit!`,
        ),
      );
      process.exit(1);
    } else {
      console.log(chalk.green(`\n✓ Size is within ${MAX_SIZE_MB}MB limit`));
    }
  } catch (error) {
    console.error(chalk.red("Error analyzing directory size:"), error);
    process.exit(1);
  }
}

main();
