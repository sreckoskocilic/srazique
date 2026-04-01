import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();

describe('Project Structure', () => {
  it('should have main.js', () =>
    expect(fs.existsSync(path.join(PROJECT_ROOT, 'main.js'))).toBe(true));
  it('should have index.html', () =>
    expect(fs.existsSync(path.join(PROJECT_ROOT, 'index.html'))).toBe(true));
  it('should have package.json', () =>
    expect(fs.existsSync(path.join(PROJECT_ROOT, 'package.json'))).toBe(true));
  it('should have .gitignore', () =>
    expect(fs.existsSync(path.join(PROJECT_ROOT, '.gitignore'))).toBe(true));
  it('should have eslint config', () =>
    expect(fs.existsSync(path.join(PROJECT_ROOT, 'eslint.config.js'))).toBe(true));
  it('should have LICENSE', () =>
    expect(fs.existsSync(path.join(PROJECT_ROOT, 'LICENSE'))).toBe(true));
});

describe('package.json Validation', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'));

  it('should have correct name', () => expect(pkg.name).toBe('srazique'));
  it('should have main entry point', () => expect(pkg.main).toBe('main.js'));
  it('should have start script', () => expect(pkg.scripts.start).toBe('electron .'));
  it('should have build script', () => expect(pkg.scripts.build).toBeDefined());
  it('should have lint script', () => expect(pkg.scripts.lint).toBeDefined());
  it('should have test script', () => expect(pkg.scripts.test).toBeDefined());
  it('should have electron in devDependencies', () =>
    expect(pkg.devDependencies.electron).toBeDefined());
  it('should have electron-builder', () =>
    expect(pkg.devDependencies['electron-builder']).toBeDefined());
  it('should have eslint', () => expect(pkg.devDependencies.eslint).toBeDefined());
  it('should have vitest', () => expect(pkg.devDependencies.vitest).toBeDefined());
  it('should have appId in build config', () => expect(pkg.build.appId).toBe('com.srazique.game'));
  it('should have asar enabled', () => expect(pkg.build.asar).toBe(true));
  it('should have productName', () => expect(pkg.build.productName).toBe('Srazique'));
  it('should have author', () => expect(pkg.author).toBe('Srecko Skocilic'));
  it('should have license', () => expect(pkg.license).toBe('MIT'));
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

describe('Build Outputs', () => {
  const distExists = fs.existsSync(path.join(PROJECT_ROOT, 'dist'));

  it('should have dist folder when built', () => {
    if (distExists) {
      const contents = fs.readdirSync(path.join(PROJECT_ROOT, 'dist'));
      expect(contents.length).toBeGreaterThan(0);
    }
  });

  const distContents = distExists ? fs.readdirSync(path.join(PROJECT_ROOT, 'dist')) : [];
  it.runIf(distContents.includes('win-unpacked'))('should have Windows unpacked build', () => {
    expect(fs.statSync(path.join(PROJECT_ROOT, 'dist', 'win-unpacked')).isDirectory()).toBe(true);
  });
});

describe('Security Configuration', () => {
  const mainJs = fs.readFileSync(path.join(PROJECT_ROOT, 'main.js'), 'utf8');

  it('should not have nodeIntegration in production', () => {
    const hasNodeIntegration = mainJs.includes('nodeIntegration: true');
    expect(hasNodeIntegration).toBe(false);
  });

  it('security handlers are unconditionally active (not isPackaged-gated)', () => {
    expect(mainJs).toContain('will-navigate');
    expect(mainJs).toContain("action: 'deny'");
    // Handlers must not be nested inside an isPackaged block (no } between isPackaged and the handler means it's inside)
    expect(mainJs).not.toMatch(/isPackaged[^}]*will-navigate/);
    expect(mainJs).not.toMatch(/isPackaged[^}]*setWindowOpenHandler/);
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

