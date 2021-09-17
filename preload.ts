import {  exposeHandles } from "./util/context-bridge";

console.log("Preload...");
exposeHandles("smartcard", ["getDevices", "waitForDevices", "waitForCard"]);

// ipcMain.handle("smartcard:getCards", (da, x) => {});
