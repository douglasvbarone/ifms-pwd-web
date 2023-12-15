import express from "express";
import { trpcMiddleware } from "./trpc";
import cors from "cors";

const server = express();

server.use(cors());
server.use("/trpc", trpcMiddleware);

if (process.env.NODE_ENV == "production") {
  server.use("/", express.static("dist/web"));

  server.get("*", (req, res) => {
    res.sendFile("index.html", { root: "dist/web" });
  });
}

export { server };
