import express from "express";
import http from "http";
import { Server } from "socket.io";
import { performance } from "perf_hooks";

import { generateNewGridAndCode, generator } from "./generator";
import { sessionStore } from "./sessionStore";
import { randomUUID } from "crypto";

import { db } from "./database";

const app = express();
const server = http.createServer(app);
server.listen(4000, () => {
  console.log("Server listening on port 4000");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const shutdownServer = () => {
  console.info("SIGTERM received");
  if (io) {
    io.close();
  }
  db.saveToDisk();
};

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    // find existing session
    const session = sessionStore.getSession(sessionID);
    if (session) {
      socket.data.sessionID = sessionID;
      // socket.userID = session.userID;
      // socket.username = session.username;
      return next();
    }
  }

  // create new session
  const newSessionID = randomUUID();
  sessionStore.setSession(newSessionID, { sessionID: newSessionID });
  socket.data.sessionID = newSessionID;

  return next();
});

io.on("connection", (socket) => {
  console.log("Socket connection established:", socket.id);

  socket.emit("session", {
    sessionID: socket.data.sessionID,
  });

  // send a list of stored payments to client
  if (db.database.payments.length > 0) {
    socket.emit("all-payments", db.database.payments);
  }

  socket.on("payment", (paymentName: string, paymentAmount: number) => {
    const payment = {
      name: paymentName,
      amount: paymentAmount,
      code: generator.currentCode,
      grid: generator.currentGrid,
    };
    socket.emit("new-payment", payment);
    db.addPayment(payment);
  });

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

process.on("SIGTERM", shutdownServer);
process.on("SIGINT", shutdownServer);

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
