import { app, BrowserWindow, Menu, ipcMain, dialog } from "electron";
import path from "path";
import { createSpriteSheet } from "./spritesheet.js";

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
    height: 425,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  //win.loadFile("index.html");
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  return win;
};

// Comment this line out if we need developer tools.
Menu.setApplicationMenu(null);

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
