import { ContextObject, createContext } from "../context-bridge";

export type MenubarCtx = {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => boolean;
  listenMaximizedChanged: (listeFn: (isMaximized: boolean) => void) => void;
};

const { registerHandle, registerListener, exposeHandles } =
  createContext<MenubarCtx>("menu");

const MenubarContext: ContextObject = {
  init: (win) => {
    registerListener("listenMaximizedChanged", (emit) => {
      win.on("maximize", () => emit(win, win.isMaximized()));
      win.on("unmaximize", () => emit(win, win.isMaximized()));
    });
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
  expose: () =>
    exposeHandles([
      "minimize",
      "maximize",
      "close",
      "isMaximized",
      "listenMaximizedChanged",
    ]),
};
export default MenubarContext;
