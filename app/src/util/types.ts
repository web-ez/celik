import { ContextType } from "../../../util/context-bridge";

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

type Celik = ContextType<"celik">;
export type LKData = Awaited<ReturnType<Celik["getAllData"]>>;
