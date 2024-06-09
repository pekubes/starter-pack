const fs = require('fs');
const path = require('path');

const inlineHTML = (htmlFilePath, componentsDir) => {
  let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  const componentPlaceholderRegex = /<!-- include ([\w-]+\.html) -->/g;
  let match;

  while ((match = componentPlaceholderRegex.exec(htmlContent)) !== null) {
    const componentName = match[1];
    const componentPath = path.join(componentsDir, componentName);
    if (fs.existsSync(componentPath)) {
      const componentContent = fs.readFileSync(componentPath, 'utf8');
      htmlContent = htmlContent.replace(match[0], componentContent);
    } else {
      console.warn(`Component ${componentName} not found in ${componentsDir}.`);
    }
  }

  return htmlContent;
};

module.exports = inlineHTML;
