const fs = require('fs');
const path = require('path');

// Get the project root - go up from wherever we are
const projectRoot = '/Users/matthewherod/Development/thickofitquotes';
const framesDir = path.join(projectRoot, 'public', 'frames');
const series4Episodes = [
  's04e01', 's04e02', 's04e03', 's04e04',
  's04e05', 's04e06', 's04e07'
];

for (const episode of series4Episodes) {
  const episodeDir = path.join(framesDir, episode);

  if (!fs.existsSync(episodeDir)) {
    console.log(`Skipping ${episode} - directory not found`);
    continue;
  }

  const files = fs.readdirSync(episodeDir);
  let renamed = 0;

  for (const file of files) {
    if (file.includes(':')) {
      const newName = file.replace(/:/g, '-');
      const oldPath = path.join(episodeDir, file);
      const newPath = path.join(episodeDir, newName);

      try {
        fs.renameSync(oldPath, newPath);
        renamed++;
      } catch (err) {
        console.error(`Error renaming ${file}:`, err.message);
      }
    }
  }

  console.log(`${episode}: Renamed ${renamed} files`);
}

console.log('Done!');
