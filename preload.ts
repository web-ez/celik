import CelikAPIContext from "./util/context/celik";
import MenubarContext from "./util/context/menubar";
import SmartcardContext from "./util/context/smartcard";

console.log("Preload...");

MenubarContext.expose();
SmartcardContext.expose();
CelikAPIContext.expose();

// ipcMain.handle("smartcard:getCards", (da, x) => {});
