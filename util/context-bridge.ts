import { BrowserWindow, contextBridge, ipcMain, ipcRenderer } from "electron";
import { SmartcardCtx } from "./context/smartcard";

type StringKey<T> = keyof T & string;
type fn = (...args: any[]) => any;
type fnParams<T> = T extends fn ? Parameters<T> : any[];
type ToPromise<T extends fn> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>;

type TransformedToPromises<T extends Record<string, fn>> = {
  [P in keyof T]: ReturnType<T[P]> extends Promise<any>
    ? T[P]
    : ToPromise<T[P]>;
};

type AppContext = {
  smartcard: SmartcardCtx;
};
export type ContextKey = keyof AppContext;
export type ContextType<T extends ContextKey> = TransformedToPromises<
  AppContext[T]
>;

type EmitFn<T> = (
  win: BrowserWindow | null,
  ...args: fnParams<fnParams<T>[0]>
) => void;

const isListener = (key: string) => (key as string).startsWith("listen");

const _createChannel = (key: string, method: string) => `${key}:${method}`;

const _registerListener = (
  key: string,
  method: string,
  fn?: (e: EmitFn<any>) => void
) => {
  const execEmit: EmitFn<any> = (win, ...args) => {
    if (win)
      win.webContents.send(_createChannel(key, method), JSON.stringify(args));
  };
  if (fn) fn(execEmit);
  return execEmit;
};

const _registerHandle = (key: string, method: string, fn: fn) =>
  ipcMain.handle(_createChannel(key, method), (ev, ...args) => fn(...args));

const _exposeHandles = (key: string, methods: string[]) => {
  const api: any = {};
  methods.map((m) => {
    const ch = _createChannel(key, m);
    if (isListener(m as any))
      api[m] = (listenFn: fn) => {
        ipcRenderer.on(ch, (ev, args) =>
          listenFn(...(JSON.parse(args) as any[]))
        );
      };
    else api[m] = (...args: any[]) => ipcRenderer.invoke(ch, ...args);
  });
  contextBridge.exposeInMainWorld(key, api);
};

export const createContext = <CTX extends Record<string, fn>>(key: string) => {
  const registerListener = <T extends StringKey<CTX>>(
    handleId: T,
    fn?: (emit: EmitFn<CTX[T]>) => void
  ) => _registerListener(key, handleId, fn);

  const registerHandle = <T extends StringKey<CTX>>(
    handleId: T,
    handle: CTX[T]
  ) => _registerHandle(key, handleId, handle);

  const exposeHandles = <T extends StringKey<CTX>>(methods: T[]) =>
    _exposeHandles(key, methods);

  return {
    registerListener,
    registerHandle,
    exposeHandles,
  };
};

export type ContextObject = {
  init: (window: BrowserWindow) => void;
  expose: () => void;
};

const getContextBridge = <Context = AppContext>() => {
  const registerListener = <
    T1 extends StringKey<Context>,
    T2 extends StringKey<Context[T1]>
  >(
    key: T1,
    method: T2,
    fn?: (emit: EmitFn<Context[T1][T2]>) => void
  ) => _registerListener(key, method, fn);

  const registerHandle = <
    T1 extends StringKey<Context>,
    T2 extends StringKey<Context[T1]>
  >(
    key: T1,
    method: T2,
    fn: Context[T1][T2]
  ) => _registerHandle(key, method, fn);

  const exposeHandles = <
    T1 extends StringKey<Context>,
    T2 extends StringKey<Context[T1]>
  >(
    key: T1,
    methods: T2[]
  ) => _exposeHandles(key, methods);

  return {
    registerListener,
    registerHandle,
    exposeHandles,
  };
};
const ContextBridge = getContextBridge();
export default ContextBridge;

/*
export const getBridgeCtx = <T1 extends keyof AppContext>(key: T1) => {
  return ((window || {}) as any)[key] as TransformedToPromises<AppContext[T1]>;
};
*/
