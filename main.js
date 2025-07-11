const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  // For Mac OS. Note activate listener is set here
  // because it should not listened to until the app is
  // initialized.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// For Windows and Linux
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
