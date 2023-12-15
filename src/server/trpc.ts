import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

import { z } from "zod";

export const { procedure, router } = initTRPC.create();

const { query, mutation, input } = procedure;

export const appRouter = router({
  hello: query(async () => {
    return "Hello World!";
  }),

  updatePassword: input(
    z.object({
      username: z.string(),
      password: z.string(),
      newPassword: z.string().min(8),
    })
  ).mutation(async () => {}),
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
});
