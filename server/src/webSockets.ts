import { Server } from "socket.io";
import { randomUUID } from "crypto";

import { httpServer } from "./httpServer";
import { sessionStore } from "./storage/sessionStore";
import { generator } from "./generator";
import database from "./storage/database";

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// MIDDLEWARES
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

  // send a list of stored payments to client that connected
  if (database.payments.length > 0) {
    socket.emit("all-payments", database.payments);
  }

  socket.on("payment", (paymentName: string, paymentAmount: number) => {
    const payment = {
      name: paymentName,
      amount: paymentAmount,
      code: generator.currentCode,
      grid: generator.currentGrid,
    };
    io.emit("new-payment", payment);
    database.addPayment(payment);
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

export default io;
