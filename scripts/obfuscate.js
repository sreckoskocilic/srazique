const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator/dist/index.js');

const cleanHtmlPath = path.join(__dirname, '..', 'tests', 'fixtures', 'index.clean.html');
const htmlPath = path.join(__dirname, '..', 'index.html');

if (!fs.existsSync(cleanHtmlPath)) {
  process.stdout.write('index.clean.html not found — skipping obfuscation.\n');
  process.exit(0);
}

const html = fs.readFileSync(cleanHtmlPath, 'utf8');

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error('No script found');
  process.exit(1);
}

const originalJs = scriptMatch[1];
process.stdout.write('Obfuscating JavaScript...\n');

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

const obfuscatedCode = obfuscationResult.getObfuscatedCode();

// Validate the obfuscated output is parseable JS before writing
try {
  new Function(obfuscatedCode);
} catch (e) {
  console.error('Obfuscated output is invalid JavaScript — aborting write:', e.message);
  process.exit(1);
}

const newHtml = html.replace(scriptMatch[1], obfuscatedCode);
fs.writeFileSync(htmlPath, newHtml, 'utf8');

process.stdout.write('Obfuscation complete!\n');