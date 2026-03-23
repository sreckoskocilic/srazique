const { app, BrowserWindow } = require('electron');

if (app.isPackaged) {
  app.on('web-contents-created', (_, contents) => {
    contents.on('will-navigate', (event) => event.preventDefault());
    contents.setWindowOpenHandler(() => ({ action: 'deny' }));
    contents.on('render-process-gone', (event, details) => {
      console.error('Renderer process crashed:', details.reason);
    });
    contents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load:', errorCode, errorDescription);
    });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 900,
    minWidth: 600,
    minHeight: 600,
    title: 'Srazique',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      sandbox: true,
    },
    autoHideMenuBar: true,
    show: false,
  });

  win.once('ready-to-show', () => win.show());
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});