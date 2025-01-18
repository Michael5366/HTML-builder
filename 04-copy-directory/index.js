const path = require('path');
const {
  readdir,
  mkdir,
  copyFile,
  unlink,
  access,
} = require('node:fs/promises');

const dirOutFiles = path.join(__dirname, 'files');
const dirDest = path.join(__dirname, 'files-copy');

(async () => {
  const filesOut = await readdir(dirOutFiles, { withFileTypes: true });

  try {
    await access(dirDest);
  } catch {
    await mkdir(dirDest, { recursive: true });
  }

  const existingFiles = await readdir(dirDest, { withFileTypes: true });

  if (existingFiles.length > 0) {
    const deletePromises = existingFiles.map((file) => {
      const filePathIn = path.join(dirDest, file.name);
      return unlink(filePathIn);
    });

    await Promise.all(deletePromises);
  }

  const copyPromises = filesOut.map((file) => {
    if (file.isFile()) {
      const filePathOut = path.join(dirOutFiles, file.name);
      const filePathIn = path.join(dirDest, file.name);

      return copyFile(filePathOut, filePathIn);
    }
  });

  await Promise.all(copyPromises);
})();
