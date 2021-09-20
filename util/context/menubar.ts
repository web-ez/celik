import { ContextObject, createContext } from "../context-bridge";

export type MenubarCtx = {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => boolean;
};

const { registerHandle, registerListener, exposeHandles } =
  createContext<MenubarCtx>("menu");

const MenubarContext: ContextObject = {
  init: (win) => {
    registerHandle("minimize", () => {
      win.minimize();
    });
    registerHandle("maximize", () => {
      win.isMaximized() ? win.unmaximize() : win.maximize();
    });
    registerHandle("close", () => {
      win.close();
    });
    registerHandle("isMaximized", () => win.isMaximized());
  },
  expose: () => exposeHandles(["minimize", "maximize", "close", "isMaximized"]),
};
export default MenubarContext;
