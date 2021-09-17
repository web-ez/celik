import { contextBridge, ipcMain, ipcRenderer } from "electron";
import { Device } from "./smartcard";

type Context = {
  smartcard: {
    getDevices: () => string[];
    waitForDevices: () => Promise<Device[]>;
    waitForCard: (device: string) => Promise<string>;
  };
};

export const registerHandle = <
  T1 extends keyof Context,
  T2 extends keyof Context[T1]
>(
  key: T1,
  method: T2,
  fn: Context[T1][T2]
) => ipcMain.handle(`${key}:${method}`, (ev, ...args) => (fn as any)(...args));

export const exposeHandles = <
  T1 extends keyof Context,
  T2 extends keyof Context[T1]
>(
  key: T1,
  methods: T2[]
) => {
  const api: any = {};
  methods.map((m) => {
    api[m] = (...args: any[]) => ipcRenderer.invoke(`${key}:${m}`, ...args);
  });
  contextBridge.exposeInMainWorld(key, api);
};

type fn = (...args: any[]) => any;
type ToPromise<T extends fn> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>;

type TransformedToPromises<T extends Record<string, fn>> = {
  [P in keyof T]: ReturnType<T[P]> extends Promise<any>
    ? T[P]
    : ToPromise<T[P]>;
};

export type ContextKey = keyof Context;
export type ContextType<T extends ContextKey> = TransformedToPromises<
  Context[T]
>;

export const getBridgeCtx = <T1 extends keyof Context>(key: T1) => {
  return ((window || {}) as any)[key] as TransformedToPromises<Context[T1]>;
};

// export const context: {
//   [K in keyof Context]: TransformedToPromises<Context[K]>;
// } = {
//   smartcard: getBridgeCtx("smartcard"),
// };
