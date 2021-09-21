import { ContextObject, createContext } from "../context-bridge";
import { Devices, Device } from "../smartcard";

export type SmartcardCtx = {
  getDevices: () => string[];
  waitForDevices: () => Promise<Device[]>;
  waitForCard: (device: string) => Promise<string>;
  listenCardDisconnected: (listenFn: () => void) => void;
  listenForDevices: (listenFn: (devices: Device[]) => void) => void;
};

const { registerHandle, registerListener, exposeHandles } =
  createContext<SmartcardCtx>("smartcard");

const SmartcardContext: ContextObject = {
  init: (win) => {
    const scDevices: Devices = new (require("smartcard").Devices)();

    const emitCardDisconnect = registerListener("listenCardDisconnected");
    registerListener("listenForDevices", (emit) => {
      scDevices.on("device-activated", (event) => {
        emit(win, event.devices);
      });
      scDevices.on("device-deactivated", (event) => {
        emit(win, event.devices);
      });
    });
    registerHandle("getDevices", () => {
      return scDevices.listDevices().map((d) => d.name);
    });
    registerHandle(
      "waitForDevices",
      () =>
        new Promise((resolve, reject) => {
          scDevices.on("device-activated", (event) => {
            resolve(event.devices);
          });
        })
    );
    registerHandle(
      "waitForCard",
      (device) =>
        new Promise((resolve, reject) => {
          const d = scDevices.lookup(device);

          d.on("card-removed", (event) => {
            emitCardDisconnect(win);
          });
          if (d.card) resolve(d.card.getAtr());
          d.on("card-inserted", (event) => {
            resolve(event.card.getAtr());
          });
        })
    );
  },
  expose: () =>
    exposeHandles([
      "getDevices",
      "listenCardDisconnected",
      "listenForDevices",
      "waitForCard",
      "waitForDevices",
    ]),
};
export default SmartcardContext;
