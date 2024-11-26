import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});

process.on("SIGTERM", () => {
  console.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
