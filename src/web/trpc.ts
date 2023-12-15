import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server/trpc";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "";

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${SERVER_URL}/trpc`,
      headers() {
        const token = localStorage.getItem("token");
        return token ? { Authorization: token } : {};
      },
    }),
  ],
});
