import express from "express";
import http from "http";
import { Server } from "socket.io";
import { performance } from "perf_hooks";

import { generateNewGridAndCode, generator } from "./generator";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connection established:", socket.id);

  socket.on("go-live", () => {
    console.log(`[RECEIVED EVENT] go-live - for socket ${socket.id}`);
    socket.emit("grid-update", generator.currentGrid, generator.currentCode);
  });

  socket.on("character-input-sent", (char: string | null) => {
    generator.biasedCharacter = char;

    io.emit("character-input-locked");
    setTimeout(() => {
      io.emit("character-input-unlocked");
    }, 4000);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});

process.on("SIGTERM", () => {
  console.info("SIGTERM received");
  if (io) {
    io.close();
  }
});

// start generating grids and codes
setInterval(() => {
  const startTime = performance.now();
  generateNewGridAndCode();
  const endTime = performance.now();

  console.log(
    `Generating grid and code took ${endTime - startTime} milliseconds.`
  );
  io.emit("grid-update", generator.currentGrid, generator.currentCode);
}, 2000);
