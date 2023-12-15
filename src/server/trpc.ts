import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

// import { z } from "zod";

export const t = initTRPC.create();

const { query, mutation, input } = t.procedure;

export const appRouter = t.router({
  hello: query(async () => {
    return "Hello World!";
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
});
