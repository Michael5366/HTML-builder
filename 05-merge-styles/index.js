const {
  readdir,
  readFile,
  unlink,
  writeFile,
  access,
  mkdir,
} = require('fs/promises');
const path = require('path');
const dirDest = path.join(__dirname, 'project-dist');
const stylesOutPath = path.join(__dirname, 'styles');

(async () => {
  const files = await readdir(stylesOutPath, { withFileTypes: true });
  const stylesArray = [];

  try {
    await access(dirDest);
  } catch {
    await mkdir(dirDest, { recursive: true });
  }

  for (const file of files) {
    if (file.isFile()) {
      const { ext } = path.parse(file.name);
      const fileOutPath = path.join(stylesOutPath, file.name);

      if (ext === '.css') {
        const fileOutData = await readFile(fileOutPath, 'utf-8');
        stylesArray.push(fileOutData);
      }
    }
  }

  const stylesJoin = stylesArray.join('\n');
  const bundlePath = path.join(dirDest, 'bundle.css');

  try {
    await unlink(bundlePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.debug(error);
    }
  }

  await writeFile(bundlePath, stylesJoin);
})();
