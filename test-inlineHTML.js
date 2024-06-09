const inlineHTML = require('./html-includer');
const path = require('path');

const testFile = path.join(__dirname, 'src/pages/index.html');
const componentsDir = path.join(__dirname, 'public/includes');

console.log(inlineHTML(testFile, componentsDir));
