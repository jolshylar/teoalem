// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { formulaRouter } from "./formula";
import { categoryRouter } from "./category";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("formula.", formulaRouter)
  .merge("category.", categoryRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
