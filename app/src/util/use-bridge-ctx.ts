import type { ContextKey, ContextType } from "../../../util/context-bridge";
import { useState } from "react";

const _getCtx = <T extends ContextKey>(key: T) =>
  (window as any)[key] as ContextType<T>;
export const useBridgeContext = <T extends ContextKey>(
  key: T
): ContextType<T> => {
  const [ctx] = useState(_getCtx(key));
  return ctx;
};

export default useBridgeContext;
