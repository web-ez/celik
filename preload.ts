import CelikAPIContext from "./util/context/celik";
import SmartcardContext from "./util/context/smartcard";

console.log("Preload...");

SmartcardContext.expose();
CelikAPIContext.expose();

// ipcMain.handle("smartcard:getCards", (da, x) => {});
