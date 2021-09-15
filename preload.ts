import {  exposeHandles } from "./util/context-bridge";

console.log("Preload...");
exposeHandles("smartcard", ["getDevices", "listenForDevices", "listenForCard"]);

// ipcMain.handle("smartcard:getCards", (da, x) => {});
