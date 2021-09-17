import SmartcardContext from "./util/context/smartcard";

console.log("Preload...");

SmartcardContext.expose();

// ipcMain.handle("smartcard:getCards", (da, x) => {});
