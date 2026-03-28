const { contextBridge, ipcRenderer } = require('electron');

// Existing API (kept for compatibility)
contextBridge.exposeInMainWorld('electronAPI', {});

// ---------------------------------------------------------------------------
// Multiplayer API — bridges renderer ↔ main process socket
// ---------------------------------------------------------------------------

// Single IPC listener dispatches to registered handlers
const _handlers = {};
ipcRenderer.on('mp:event', (_e, event, data) => {
  (_handlers[event] || []).forEach(h => h(data));
});

contextBridge.exposeInMainWorld('multiplayerAPI', {
  connect:    (url)         => ipcRenderer.invoke('mp:connect', url),
  emit:       (event, data) => ipcRenderer.invoke('mp:emit', event, data),
  on:         (event, fn)   => { if (!_handlers[event]) _handlers[event] = []; _handlers[event].push(fn); },
  disconnect: ()            => ipcRenderer.invoke('mp:disconnect'),
});
