import { io } from "socket.io-client";

const socket = io("http://localhost:4000", { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export const getWebSocket = (sessionID: string | null) => {
  if (sessionID) {
    socket.auth = { sessionID };
    socket.connect();
  } else {
    socket.connect();
  }

  return socket;
};
