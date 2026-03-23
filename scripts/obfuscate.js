const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator/dist/index.js');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error('No script found');
  process.exit(1);
}

const originalJs = scriptMatch[1];
console.log('Obfuscating JavaScript...');

const obfuscationResult = JavaScriptObfuscator.obfuscate(originalJs, {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  stringArrayShuffling: false,
  simplify: true,
  renameVariables: true,
  renameGlobals: false,
  disableConsoleOutput: false,
  numbersToExpressions: true,
});

const newHtml = html.replace(scriptMatch[1], obfuscationResult.getObfuscatedCode());
fs.writeFileSync(htmlPath, newHtml, 'utf8');

console.log('Obfuscation complete!');