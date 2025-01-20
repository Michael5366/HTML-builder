const {
  mkdir,
  readFile,
  readdir,
  writeFile,
  copyFile,
} = require('fs/promises');
const path = require('path');
const dirDest = path.join(__dirname, 'project-dist');
const componentsOutPath = path.join(__dirname, 'components');
const templateOutPath = path.join(__dirname, 'template.html');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

const copyDir = async (src, dest) => {
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isFile()) {
      await copyFile(srcPath, destPath);
    } else if (entry.isDirectory()) {
      await mkdir(destPath, { recursive: true });
      await copyDir(srcPath, destPath);
    }
  }
};

(async () => {
  try {
    // 1. project-dist
    await mkdir(dirDest, { recursive: true });

    // 2. html
    let readTemplate = await readFile(templateOutPath, 'utf-8');
    const templateForComponents = {};
    const components = await readdir(componentsOutPath, {
      withFileTypes: true,
    });

    for (const component of components) {
      if (component.isFile()) {
        const { ext } = path.parse(component.name);
        if (ext === '.html') {
          const componentPath = path.join(componentsOutPath, component.name);
          const readComponent = await readFile(componentPath, 'utf-8');
          const componentName = component.name.split('.')[0];
          templateForComponents[`{{${componentName}}}`] = readComponent;
        }
      }
    }

    for (const [tag, component] of Object.entries(templateForComponents)) {
      readTemplate = readTemplate.replace(new RegExp(tag, 'g'), component);
    }

    const newFilePath = path.join(dirDest, 'index.html');
    await writeFile(newFilePath, readTemplate);

    // 3. styles
    const styles = await readdir(stylesPath, { withFileTypes: true });
    const styleArray = [];

    for (const style of styles) {
      if (style.isFile()) {
        const { ext } = path.parse(style.name);
        if (ext === '.css') {
          const stylePath = path.join(stylesPath, style.name);
          const readStyle = await readFile(stylePath, 'utf-8');
          styleArray.push(readStyle);
        }
      }
    }

    const newStyleFilePath = path.join(dirDest, 'style.css');
    await writeFile(newStyleFilePath, styleArray.join('\n'));

    // 4. assets
    const assetsDestPath = path.join(dirDest, 'assets');
    await mkdir(assetsDestPath, { recursive: true });
    await copyDir(assetsPath, assetsDestPath);
  } catch (error) {
    console.error(error);
  }
})();
