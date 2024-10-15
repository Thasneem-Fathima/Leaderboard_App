const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/assets', 'build-metadata.json');
const currentDate = new Date().toISOString();

const buildMetadata = {
  buildDate: currentDate
};

fs.writeFileSync(filePath, JSON.stringify(buildMetadata, null, 2));
console.log('Build date updated:', currentDate);
