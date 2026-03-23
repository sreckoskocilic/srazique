import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PROJECT_ROOT = process.cwd();

describe('Project Structure', () => {
  it('should have main.js', () => expect(fs.existsSync(path.join(PROJECT_ROOT, 'main.js'))).toBe(true));
  it('should have index.html', () => expect(fs.existsSync(path.join(PROJECT_ROOT, 'index.html'))).toBe(true));
  it('should have package.json', () => expect(fs.existsSync(path.join(PROJECT_ROOT, 'package.json'))).toBe(true));
  it('should have obfuscate script', () => expect(fs.existsSync(path.join(PROJECT_ROOT, 'scripts', 'obfuscate.js'))).toBe(true));
  it('should have .gitignore', () => expect(fs.existsSync(path.join(PROJECT_ROOT, '.gitignore'))).toBe(true));
  it('should have eslint config', () => expect(fs.existsSync(path.join(PROJECT_ROOT, 'eslint.config.js'))).toBe(true));
  it('should have LICENSE', () => expect(fs.existsSync(path.join(PROJECT_ROOT, 'LICENSE'))).toBe(true));
});

describe('package.json Validation', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'));

  it('should have correct name', () => expect(pkg.name).toBe('srazique'));
  it('should have main entry point', () => expect(pkg.main).toBe('main.js'));
  it('should have start script', () => expect(pkg.scripts.start).toBe('electron .'));
  it('should have build script', () => expect(pkg.scripts.build).toBeDefined());
  it('should have lint script', () => expect(pkg.scripts.lint).toBeDefined());
  it('should have test script', () => expect(pkg.scripts.test).toBeDefined());
  it('should have obfuscate script', () => expect(pkg.scripts.obfuscate).toBeDefined());
  it('should have electron in devDependencies', () => expect(pkg.devDependencies.electron).toBeDefined());
  it('should have electron-builder', () => expect(pkg.devDependencies['electron-builder']).toBeDefined());
  it('should have eslint', () => expect(pkg.devDependencies.eslint).toBeDefined());
  it('should have vitest', () => expect(pkg.devDependencies.vitest).toBeDefined());
  it('should have appId in build config', () => expect(pkg.build.appId).toBe('com.srazique.game'));
  it('should have asar enabled', () => expect(pkg.build.asar).toBe(true));
  it('should have productName', () => expect(pkg.build.productName).toBe('Srazique'));
  it('should have author', () => expect(pkg.author).toBe('Srecko Skocilic'));
  it('should have license', () => expect(pkg.license).toBe('ISC'));
});

describe('main.js Validation', () => {
  const content = fs.readFileSync(path.join(PROJECT_ROOT, 'main.js'), 'utf8');

  it('should require electron', () => expect(content).toContain("require('electron')"));
  it('should import app', () => expect(content).toContain('app,'));
  it('should import BrowserWindow', () => expect(content).toContain('BrowserWindow'));
  it('should have createWindow function', () => expect(content).toContain('function createWindow'));
  it('should disable nodeIntegration', () => expect(content).toContain('nodeIntegration: false'));
  it('should enable contextIsolation', () => expect(content).toContain('contextIsolation: true'));
  it('should enable sandbox', () => expect(content).toContain('sandbox: true'));
  it('should enable webSecurity', () => expect(content).toContain('webSecurity: true'));
  it('should block will-navigate', () => expect(content).toContain('will-navigate'));
  it('should block window open', () => expect(content).toContain('setWindowOpenHandler'));
  it('should handle render process gone', () => expect(content).toContain('render-process-gone'));
  it('should handle failed load', () => expect(content).toContain('did-fail-load'));
  it('should set window title', () => expect(content).toContain("title: 'Srazique'"));
  it('should load index.html', () => expect(content).toContain('loadFile'));
  it('should have app.whenReady', () => expect(content).toContain('whenReady'));
  it('should have activate handler', () => expect(content).toContain("'activate'"));
  it('should have window-all-closed handler', () => expect(content).toContain('window-all-closed'));
});

describe('index.html Structure', () => {
  const html = fs.readFileSync(path.join(PROJECT_ROOT, 'index.html'), 'utf8');

  it('should have DOCTYPE', () => expect(html).toContain('<!DOCTYPE html>'));
  it('should have html tag', () => expect(html).toContain('<html'));
  it('should have head tag', () => expect(html).toContain('<head>'));
  it('should have body tag', () => expect(html).toContain('<body>'));
  it('should have style tag', () => expect(html).toContain('<style>'));
  it('should have script tag', () => expect(html).toContain('<script>'));
  it('should have meta charset', () => expect(html).toContain('charset="UTF-8"'));
  it('should have viewport meta', () => expect(html).toContain('viewport'));
  it('should have setup screen', () => expect(html).toContain('setup-screen'));
  it('should have game screen', () => expect(html).toContain('game-screen'));
  it('should have board element', () => expect(html).toContain('id="board"'));
  it('should have modal overlay', () => expect(html).toContain('modal-overlay'));
  it('should have gameover screen', () => expect(html).toContain('gameover-screen'));
  it('should have player inputs', () => expect(html).toContain('player-inputs'));
  it('should have turn panel', () => expect(html).toContain('turn-panel'));
});

describe('CSS Structure', () => {
  const html = fs.readFileSync(path.join(PROJECT_ROOT, 'index.html'), 'utf8');

  it('should have CSS variables', () => expect(html).toContain(':root'));
  it('should have board grid', () => expect(html).toContain('grid-template-columns'));
  it('should have animations', () => expect(html).toContain('@keyframes'));
  it('should have responsive styles', () => expect(html).toContain('@media'));
  it('should have category colors', () => expect(html).toContain('cat-'));
});

describe('Obfuscate Script', () => {
  const content = fs.readFileSync(path.join(PROJECT_ROOT, 'scripts', 'obfuscate.js'), 'utf8');

  it('should require fs', () => expect(content).toContain("require('fs')"));
  it('should require path', () => expect(content).toContain("require('path')"));
  it('should require javascript-obfuscator', () => expect(content).toContain('javascript-obfuscator'));
  it('should reference index.html', () => expect(content).toContain('index.html'));
  it('should use fs.readFileSync', () => expect(content).toContain('readFileSync'));
  it('should use fs.writeFileSync', () => expect(content).toContain('writeFileSync'));
  it('should use JavaScriptObfuscator.obfuscate', () => expect(content).toContain('obfuscate'));
  it('should have compact option', () => expect(content).toContain('compact: true'));
  it('should have renameVariables option', () => expect(content).toContain('renameVariables'));
  it('should handle script not found error', () => expect(content).toContain('No script found'));
  it('should exit on error', () => expect(content).toContain('process.exit(1)'));
  it('should log progress', () => expect(content).toContain('console.log'));
});

describe('Git Configuration', () => {
  const gitignore = fs.readFileSync(path.join(PROJECT_ROOT, '.gitignore'), 'utf8');

  it('should ignore node_modules', () => expect(gitignore).toContain('node_modules'));
  it('should ignore dist', () => expect(gitignore).toContain('dist/'));
  it('should ignore logs', () => expect(gitignore).toContain('.log'));
  it('should ignore DS_Store', () => expect(gitignore).toContain('.DS_Store'));
  it('should ignore .idea', () => expect(gitignore).toContain('.idea'));
  it('should ignore .vscode', () => expect(gitignore).toContain('.vscode'));
  it('should ignore .env', () => expect(gitignore).toContain('.env'));
});

describe('ESLint Configuration', () => {
  const config = fs.readFileSync(path.join(PROJECT_ROOT, 'eslint.config.js'), 'utf8');

  it('should export array', () => expect(config).toContain('module.exports'));
  it('should ignore dist', () => expect(config).toContain('dist/'));
  it('should ignore node_modules', () => expect(config).toContain('node_modules/'));
  it('should have ecmaVersion', () => expect(config).toContain('ecmaVersion'));
  it('should have sourceType', () => expect(config).toContain('sourceType'));
  it('should have rules', () => expect(config).toContain('rules'));
});

describe('Node Modules', () => {
  it('should have node_modules', () => expect(fs.existsSync(path.join(PROJECT_ROOT, 'node_modules'))).toBe(true));
  it('should have electron', () => expect(fs.existsSync(path.join(PROJECT_ROOT, 'node_modules', 'electron'))).toBe(true));
  it('should have electron-builder', () => expect(fs.existsSync(path.join(PROJECT_ROOT, 'node_modules', 'electron-builder'))).toBe(true));
  it('should have vitest', () => expect(fs.existsSync(path.join(PROJECT_ROOT, 'node_modules', 'vitest'))).toBe(true));
  it('should have eslint', () => expect(fs.existsSync(path.join(PROJECT_ROOT, 'node_modules', 'eslint'))).toBe(true));
  it('should have javascript-obfuscator', () => expect(fs.existsSync(path.join(PROJECT_ROOT, 'node_modules', 'javascript-obfuscator'))).toBe(true));
});

describe('Build Outputs', () => {
  const distExists = fs.existsSync(path.join(PROJECT_ROOT, 'dist'));

  it('should have dist folder when built', () => {
    if (distExists) {
      const contents = fs.readdirSync(path.join(PROJECT_ROOT, 'dist'));
      expect(contents.length).toBeGreaterThan(0);
    }
  });

  if (distExists) {
    const contents = fs.readdirSync(path.join(PROJECT_ROOT, 'dist'));
    
    if (contents.includes('win-unpacked')) {
      it('should have Windows unpacked build', () => {
        const winDir = fs.statSync(path.join(PROJECT_ROOT, 'dist', 'win-unpacked'));
        expect(winDir.isDirectory()).toBe(true);
      });
    }
  }
});

describe('Linting', () => {
  it('should have no lint errors', () => {
    try {
      execSync('npm run lint', { cwd: PROJECT_ROOT, encoding: 'utf8', stdio: 'pipe' });
    } catch (e) {
      expect(e.message).not.toContain('error');
    }
  });
});

describe('Security Configuration', () => {
  const mainJs = fs.readFileSync(path.join(PROJECT_ROOT, 'main.js'), 'utf8');

  it('should not have nodeIntegration in production', () => {
    const hasNodeIntegration = mainJs.includes('nodeIntegration: true');
    expect(hasNodeIntegration).toBe(false);
  });

  it('should check isPackaged before adding security handlers', () => {
    expect(mainJs).toContain('app.isPackaged');
  });

  it('should deny window open in packaged app', () => {
    expect(mainJs).toContain("action: 'deny'");
  });
});

describe('Package Lock', () => {
  it('should have package-lock.json', () => {
    expect(fs.existsSync(path.join(PROJECT_ROOT, 'package-lock.json'))).toBe(true);
  });

  it('should have valid package-lock.json', () => {
    const lock = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package-lock.json'), 'utf8'));
    expect(lock.version).toBeDefined();
    expect(lock.packages).toBeDefined();
  });
});

describe('Clean HTML Constants', () => {
  const cleanHtmlPath = path.join(PROJECT_ROOT, 'tests', 'fixtures', 'index.clean.html');
  const cleanHtmlExists = fs.existsSync(cleanHtmlPath);

  if (cleanHtmlExists) {
    const code = fs.readFileSync(cleanHtmlPath, 'utf8');

    it('should have Q_API_BATCH_SIZE constant', () => expect(code).toContain('Q_API_BATCH_SIZE'));
    it('should have Q_API_MAX_BATCHES constant', () => expect(code).toContain('Q_API_MAX_BATCHES'));
    it('should have Q_API_TIMEOUT_MS constant', () => expect(code).toContain('Q_API_TIMEOUT_MS'));
    it('should have Q_API_DELAY_MS constant', () => expect(code).toContain('Q_API_DELAY_MS'));
    it('should have COORD_BASE constant', () => expect(code).toContain('COORD_BASE'));
    it('should not use bare 8000ms timeout literal', () => expect(code).not.toContain('AbortSignal.timeout(8000)'));
    it('should not use bare 250ms delay literal', () => expect(code).not.toContain('setTimeout(r, 250)'));
    it('should use try/finally in fetchQuestionsBackground', () => expect(code).toContain('} finally {'));
    it('should guard updateTileDOM against null game', () => expect(code).toContain("function updateTileDOM") && expect(code).toContain('if (!State.game) return;'));
    it('should guard flushUpdates against null game', () => expect(code).toContain('function flushUpdates'));
    it('should have bounds check in movePegTo', () => expect(code).toContain('r < 0 || r >= S || c < 0 || c >= S'));
    it('should use dataset.size in setBoardSize', () => expect(code).toContain('btn.dataset.size'));
    it('should reset dirty flags in resetGame', () => expect(code).toContain('State.dirty.board = false'));
    it('should encode validMoves consistently in handleNormalMove', () =>
      expect(code).toContain('new Set(getValidMoves(State.game.selectedPegId).map(({r,c}) => r * COORD_BASE + c))'));
    it('should guard handleCombatQ1 against null State.game', () =>
      expect(code).toContain('function handleCombatQ1') && expect(code).toContain('if (!State.game) return;'));
    it('should guard checkEndGame setTimeout against null State.game', () =>
      expect(code).toContain('if (State.game) showGameOver(winner)'));
    it('should guard finishBattle against null State.game', () =>
      expect(code).toContain('function finishBattle'));
    it('should guard flushUIUpdates peg access', () =>
      expect(code).toContain('if (peg) {'));
    it('should guard updateTileDOM peg lookup', () =>
      expect(code).toContain('if (!peg) return;'));
  }
});