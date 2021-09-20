import { app, BrowserWindow } from "electron";
import * as path from "path";
import CelikAPIContext from "./util/context/celik";
import SmartcardContext from "./util/context/smartcard";
import { isDev } from "./util/is-dev";

const createWindow = () => {
  const _win = new BrowserWindow({
    width: 1200,
    height: 800,
    minHeight: 700,
    minWidth: 500,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev()) _win.loadURL("http://localhost:3000");
  else _win.loadFile(path.join(__dirname, "..", "app", "build", "index.html"));

  onCreatedWindow(_win);
  return _win;
};

const onCreatedWindow = (w: BrowserWindow) => {
  SmartcardContext.init(w);
  CelikAPIContext.init(w);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
