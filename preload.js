const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("spriteSheetMaker", {});
