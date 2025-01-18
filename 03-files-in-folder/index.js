const { readdir } = require('node:fs/promises');
const { stat } = require('node:fs/promises');
const path = require('path');
const filesPath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const files = await readdir(filesPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(filesPath, file.name);
        const fileStats = await stat(filePath);
        const { name, ext } = path.parse(file.name);
        const fileSize = (fileStats.size / 1024).toFixed(3);
        console.log(`${name} - ${ext.slice(1)} - ${fileSize}kb`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
