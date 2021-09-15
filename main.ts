import { app, BrowserWindow } from "electron";
import * as path from "path";
import { isDev } from "./util/is-dev";
import { registerHandle } from "./util/context-bridge";
import { Devices } from "./util/smartcard";

const scDevices: Devices = new (require("smartcard").Devices)();
registerHandle("smartcard", "getDevices", () => {
  return scDevices.listDevices().map((d) => d.name);
});
registerHandle("smartcard", "listenForDevices", (listenFn) => {
  scDevices.on("device-activated", (event) => {
    listenFn(event.devices);
  });
});
registerHandle("smartcard", "listenForCard", (device, listenFn) => {
  const d = scDevices.lookup(device);
  d.on("card-inserted", (event) => {
    listenFn(event.card.getAttr());
  });
});

const createWindow = () => {
  console.log(path.join(__dirname, "preload.js"));
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev()) win.loadURL("http://localhost:3000");
  else win.loadFile(path.join(__dirname, "..", "app", "build", "index.html"));

  return win;
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
