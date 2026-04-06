const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getQuestions: () => ipcRenderer.invoke('questions:get'),
});
