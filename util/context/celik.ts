import { ContextObject, createContext } from "../context-bridge";
import { MUPCelikApi } from "node_celik";

export type CelikAPICtx = {
  init: (device: string) => Promise<boolean>;
  getAllData: () => Promise<any>;
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
          return true;
        }
        console.log("CELIK: Creating Api.");
        api = new MUPCelikApi(dev);
        return true;
      } catch (e: any) {
        console.log(e);
        return false;
      }
    });

    registerHandle("getAllData", async () => {
      try {
        console.log("CELIK: Reading data.");
        return await api.readAllData();
      } catch (e: any) {
        console.log("Error:", e);
        return {};
      }
    });
  },
  expose: () => exposeHandles(["init", "getAllData"]),
};
export default CelikAPIContext;
