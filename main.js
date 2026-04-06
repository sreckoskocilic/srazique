const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { decryptQuestions } = require('./scripts/decrypt-questions.js');

let logFile = null;
let win = null;

function log(level, ...args) {
  const timestamp = new Date().toISOString();
  const msg = `[${timestamp}] [${level}] ${args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ')}\n`;
  if (level === 'ERROR') {
    console.error(msg);
  } else {
    console.log(msg);
  }
  if (logFile) {
    try {
      fs.appendFileSync(logFile, msg);
    } catch (e) {
      log('WARN', 'Failed to write to log file:', e.message);
    }
  }
}

process.on('uncaughtException', (error) => {
  log('ERROR', error.message);
  app.exit(1);
});
process.on('unhandledRejection', (reason) => {
  log('ERROR', reason);
});

let windowStateFile = null;

function loadWindowState() {
  if (!windowStateFile) {
    return { width: 900, height: 900, x: undefined, y: undefined };
  }
  try {
    if (fs.existsSync(windowStateFile)) {
      return JSON.parse(fs.readFileSync(windowStateFile, 'utf8'));
    }
  } catch (e) {
    log('WARN', 'Failed to read window state:', e.message);
  }
  return { width: 900, height: 900, x: undefined, y: undefined };
}

function saveWindowState(win) {
  if (!windowStateFile) {
    return;
  }
  try {
    fs.writeFileSync(windowStateFile, JSON.stringify(win.getBounds()));
  } catch (e) {
    log('WARN', 'Failed to save window state:', e.message);
  }
}

function createWindow() {
  const ws = loadWindowState();
  win = new BrowserWindow({
    width: ws.width,
    height: ws.height,
    x: ws.x,
    y: ws.y,
    minWidth: 600,
    minHeight: 600,
    title: 'Srazique',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    show: false,
  });

  // DevTools open for debugging (remove for production)
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }

  // Security handlers — always block external navigation regardless of dev/prod
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) {
      event.preventDefault();
      log('WARN', `Blocked navigation to ${url}`);
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    log('WARN', `Blocked window open to ${url}`);
    return { action: 'deny' };
  });

  win.webContents.on('render-process-gone', (event, details) => {
    log('ERROR', `Render process gone: ${details.reason}`);
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log('ERROR', `Failed to load: ${errorDescription} (${errorCode})`);
  });

  let saveStateTimer = null;
  const debouncedSave = () => {
    clearTimeout(saveStateTimer);
    saveStateTimer = setTimeout(() => saveWindowState(win), 500);
  };
  win.on('close', () => {
    clearTimeout(saveStateTimer);
    saveWindowState(win);
  });
  win.on('resize', debouncedSave);
  win.on('move', debouncedSave);
  win.once('ready-to-show', () => win.show());

  win.loadFile('index.html');
  log('INFO', 'Window created');
}

ipcMain.handle('questions:get', async () => {
  const encPath = path.join(__dirname, 'questions.enc');
  const jsonPath = path.join(__dirname, 'questions.json');

  try {
    const encrypted = await fs.promises.readFile(encPath, 'utf8');
    const json = decryptQuestions(encrypted);
    log('INFO', 'Questions loaded (encrypted)');
    return json;
  } catch (e) {
    if (e.code !== 'ENOENT') {
      log('WARN', 'Failed to decrypt questions:', e.message);
    }
  }

  try {
    const json = await fs.promises.readFile(jsonPath, 'utf8');
    log('INFO', 'Questions loaded (json)');
    return json;
  } catch (e) {
    log(
      'WARN',
      e.code === 'ENOENT'
        ? 'No questions file found'
        : `Failed to read questions.json: ${e.message}`
    );
    return null;
  }
});

app.whenReady().then(() => {
  const logDir = path.join(app.getPath('userData'), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  logFile = path.join(logDir, `srazique-${new Date().toISOString().slice(0, 10)}.log`);
  windowStateFile = path.join(app.getPath('userData'), 'window-state.json');

  // Purge log files older than 7 days
  try {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    for (const f of fs.readdirSync(logDir)) {
      const filePath = path.join(logDir, f);
      if (fs.statSync(filePath).mtimeMs < cutoff) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (e) {
    log('WARN', 'Failed to purge old logs:', e.message);
  }

  log('INFO', 'App ready');
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  log('INFO', 'All closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
