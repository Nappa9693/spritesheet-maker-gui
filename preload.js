const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("spriteSheetMaker", {
  createSpriteSheet: (srcDirectory, destination, columnsCount) =>
    ipcRenderer.invoke(
      "create-spritesheet",
      srcDirectory,
      destination,
      columnsCount,
    ),
  onCreateSpriteSheetMessage: (callback) =>
    ipcRenderer.on("create-spritesheet-message", (_event, value) =>
      callback(value),
    ),
  onCreateSpriteSheetErrorMessage: (callback) =>
    ipcRenderer.on("create-spritesheet-error-message", (_event, value) =>
      callback(value),
    ),
});

contextBridge.exposeInMainWorld("electronAPI", {
  openFolder: () => ipcRenderer.invoke("dialog:openFolder"),
});
