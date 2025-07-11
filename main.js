const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const { createSpriteSheet } = require("./spritesheet.js");

async function handleDirectoryOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (!canceled) {
    return filePaths[0];
  }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 500,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");

  return win;
};

// Comment this line out if we need developer tools.
//Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  const mainWindow = createWindow();

  ipcMain.handle("create-spritesheet", async (event, ...args) => {
    createSpriteSheet(mainWindow.webContents, ...args);
  });
  ipcMain.handle("dialog:openFolder", handleDirectoryOpen);

  // For Mac OS. Note activate listener is set here
  // because it should not listened to until the app is
  // initialized.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// For Windows and Linux
app.on("windows-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
