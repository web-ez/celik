import { contextBridge, ipcMain, ipcRenderer } from "electron";

type Context = {
  smartcard: {
    getCards: () => string[];
    listenForCards: () => void;
    pickCard: (card: string) => boolean;
  };
};
