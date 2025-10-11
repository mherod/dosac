const fs = require('fs');
const path = require('path');

const projectRoot = '/Users/matthewherod/Development/thickofitquotes';
const indexPath = path.join(projectRoot, 'public', 'frame-index.json');

console.log('Reading frame index...');
const indexData = fs.readFileSync(indexPath, 'utf8');

console.log('Fixing Series 4 URLs...');
// Replace colons with hyphens in all s04 episode paths
// Pattern: /frames/s04eXX/XX-XX:XX.XXX/ -> /frames/s04eXX/XX-XX-XX.XXX/
const fixedData = indexData.replace(
  /(\/frames\/s04e\d{2}\/\d{2}-\d{2}):(\d{2}\.\d{3})/g,
  '$1-$2'
);

// Count how many replacements were made
const originalMatches = (indexData.match(/(\/frames\/s04e\d{2}\/\d{2}-\d{2}):(\d{2}\.\d{3})/g) || []).length;

console.log(`Fixed ${originalMatches} Series 4 URLs`);

console.log('Writing updated index...');
fs.writeFileSync(indexPath, fixedData, 'utf8');

console.log('Done!');
