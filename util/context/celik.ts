import { ContextObject, createContext } from "../context-bridge";
import { MUPCelikApi } from "node_celik";
import * as log from "electron-log";

export type CelikAPICtx = {
  init: (device: string) => void;
  getAllData: typeof MUPCelikApi.prototype.readAllData;
};

const { registerHandle, registerListener, exposeHandles } =
  createContext<CelikAPICtx>("celik");

const CelikAPIContext: ContextObject = {
  init: (win) => {
    let api: MUPCelikApi;

    registerHandle("init", async (dev) => {
      try {
        if (api) {
          console.log("CELIK: Api exists.");
          await api.endRead();
          await api.startRead(dev);
          console.log("CELIK: Restarted reading.");
          return;
        }
        console.log("CELIK: Creating Api.");
        api = new MUPCelikApi(dev);
      } catch (e: any) {
        console.log(e);
        log.error(e);
        throw e;
      }
    });

    registerHandle("getAllData", async () => {
      try {
        console.log("CELIK: Reading data.");
        return await api.readAllData();
      } catch (e: any) {
        console.log("Error:", e);
        throw e;
      }
    });
  },
  expose: () => exposeHandles(["init", "getAllData"]),
};
export default CelikAPIContext;
