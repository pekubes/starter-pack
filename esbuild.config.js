const esbuild = require('esbuild');
const { sassPlugin } = require('esbuild-sass-plugin');
const fs = require('fs');
const path = require('path');
const inlineHTML = require('./html-includer');

const componentsDir = path.join(__dirname, 'public/includes');
const pagesDir = path.join(__dirname, 'src/pages');
const outputDir = path.join(__dirname, 'public/pages');

const processHTMLFiles = () => {
  fs.readdirSync(pagesDir).forEach(file => {
    const filePath = path.join(pagesDir, file);
    const outputFilePath = path.join(outputDir, file);
    const content = inlineHTML(filePath, componentsDir);
    fs.writeFileSync(outputFilePath, content);
  });
};

// Initial build for HTML files
processHTMLFiles();

(async () => {
  try {
    // Create an ESBuild context for the build process
    const ctx = await esbuild.context({
      entryPoints: ['src/ts/main.ts', 'src/styles/index.scss'],
      bundle: true,
      minify: true,
      sourcemap: true,
      outdir: 'dist',
      plugins: [sassPlugin()],
    });

    // Set up file watch with rebuild functionality
    ctx.watch();
    
    console.log('Watching for changes...');

    // Ensure HTML files are reprocessed when relevant files change
    fs.watch(pagesDir, (eventType, filename) => {
      if (filename && eventType === 'change') {
        console.log(`Rebuilding HTML due to changes in ${filename}`);
        processHTMLFiles();
      }
    });

    fs.watch(componentsDir, (eventType, filename) => {
      if (filename && eventType === 'change') {
        console.log(`Rebuilding HTML due to changes in ${filename}`);
        processHTMLFiles();
      }
    });
  } catch (error) {
    console.error('Error during build:', error);
    process.exit(1);
  }
})();
