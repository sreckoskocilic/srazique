const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { io: socketIO } = require('socket.io-client');

let logFile = null;
let win = null;
let _socket = null;

// ---------------------------------------------------------------------------
// Multiplayer socket bridge (IPC → socket.io-client in main process)
// ---------------------------------------------------------------------------

const FORWARDED_EVENTS = [
  'connect', 'disconnect',
  'room:player_joined', 'room:player_left', 'room:full',
  'game:start', 'game:question_start', 'state:update',
];

ipcMain.handle('mp:connect', async (_e, url) => {
  if (_socket) { _socket.disconnect(); _socket = null; }
  return new Promise((resolve) => {
    _socket = socketIO(url, { transports: ['websocket'] });

    _socket.once('connect', () => {
      FORWARDED_EVENTS.forEach(evt => {
        _socket.on(evt, data => win?.webContents.send('mp:event', evt, data));
      });
      resolve({ ok: true, id: _socket.id });
    });

    _socket.once('connect_error', err => {
      resolve({ error: err.message });
    });

    setTimeout(() => resolve({ error: 'Connection timeout' }), 8000);
  });
});

ipcMain.handle('mp:emit', async (_e, event, data) => {
  if (!_socket?.connected) {return { error: 'Not connected' };}
  return new Promise(resolve => _socket.emit(event, data, resolve));
});

ipcMain.handle('mp:disconnect', async () => {
  _socket?.disconnect();
  _socket = null;
});

function log(level, ...args) {
  const timestamp = new Date().toISOString();
  const msg = `[${timestamp}] [${level}] ${args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ')}\n`;
  if (level === 'ERROR') {
    console.error(msg);
  } else {
    console.warn(msg);
  }
  if (logFile) {
    try {
      fs.appendFileSync(logFile, msg);
    } catch {}
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
  } catch {}
  return { width: 900, height: 900, x: undefined, y: undefined };
}

function saveWindowState(win) {
  if (!windowStateFile) {
    return;
  }
  try {
    fs.writeFileSync(windowStateFile, JSON.stringify(win.getBounds()));
  } catch {}
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

  // Security handlers
  win.webContents.on('will-navigate', (event, url) => {
    if (app.isPackaged) {
      event.preventDefault();
      log('WARN', `Blocked navigation to ${url}`);
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (app.isPackaged) {
      log('WARN', `Blocked window open to ${url}`);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  win.webContents.on('render-process-gone', (event, details) => {
    log('ERROR', `Render process gone: ${details.reason}`);
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log('ERROR', `Failed to load: ${errorDescription} (${errorCode})`);
  });

  win.on('close', () => saveWindowState(win));
  win.on('resize', () => saveWindowState(win));
  win.on('move', () => saveWindowState(win));
  win.once('ready-to-show', () => win.show());

  // Load questions from encrypted file after page loads
  win.webContents.on('did-finish-load', async () => {
    const encPath = path.join(__dirname, 'questions.enc');
    const jsonPath = path.join(__dirname, 'questions.json');

    // Try encrypted file first, fall back to plain JSON
    let questionsJson;
    let source;

    if (fs.existsSync(encPath)) {
      try {
        const { decryptQuestions } = require('./scripts/decrypt-questions.js');
        const encrypted = fs.readFileSync(encPath, 'utf8');
        questionsJson = decryptQuestions(encrypted);
        source = 'encrypted';
      } catch (e) {
        log('WARN', 'Failed to decrypt questions:', e.message);
      }
    }

    if (!questionsJson && fs.existsSync(jsonPath)) {
      questionsJson = fs.readFileSync(jsonPath, 'utf8');
      source = 'json';
    }

    if (!questionsJson) {
      log('WARN', 'No questions file found');
      return;
    }

    try {
      const injectScript = `
        (function() {
          try {
            window.SRAZ_QUESTIONS = JSON.parse(${JSON.stringify(questionsJson)});
            console.log('Questions loaded from ${source}:', Object.keys(window.SRAZ_QUESTIONS).length, 'categories');
            
            // Log first few categories
            var cats = Object.keys(window.SRAZ_QUESTIONS);
            for (var i = 0; i < Math.min(3, cats.length); i++) {
              console.log('  ' + cats[i] + ': ' + window.SRAZ_QUESTIONS[cats[i]].length + ' questions');
            }
            
            // Reset and call loadQuestions
            if (typeof State !== 'undefined' && State.questionsLoaded) {
              State.questionsLoaded = false;
            }
            if (typeof loadQuestions === 'function') {
              loadQuestions();
              console.log('loadQuestions() called successfully');
            }
          } catch (e) {
            console.error('Error loading questions:', e);
          }
        })();
      `;

      await win.webContents.executeJavaScript(injectScript);

      const numCategories = await win.webContents.executeJavaScript(
        'Object.keys(window.SRAZ_QUESTIONS || {}).length'
      );
      log('INFO', `Questions loaded from ${source}, ${numCategories} categories`);
    } catch (e) {
      log('ERROR', 'Failed to load questions:', e.message);
    }
  });

  win.loadFile('index.html');
  log('INFO', 'Window created');
}

app.whenReady().then(() => {
  const logDir = path.join(app.getPath('userData'), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  logFile = path.join(logDir, `srazique-${new Date().toISOString().slice(0, 10)}.log`);
  windowStateFile = path.join(app.getPath('userData'), 'window-state.json');
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
