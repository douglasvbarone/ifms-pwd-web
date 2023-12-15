import "dotenv/config";

import { server } from "./server";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const [major] = process.versions.node.split(".").map(Number);

if (major < 21) throw new Error("Node version must be >= 21.0.0");

export const SERVER_PORT = process.env.PORT || 8080;

server.listen(SERVER_PORT, () => {
  console.log(`Server ready on http://localhost:${SERVER_PORT}`);
});
