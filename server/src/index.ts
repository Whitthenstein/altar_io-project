import { performance } from "perf_hooks";

import { generateNewGridAndCode, generator } from "./generator";
import database from "./storage/database";
import io from "./webSockets";

const shutdownServer = () => {
  console.info("SIGTERM received");
  if (io) {
    io.close();
  }
  database.saveToDisk();
};

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
