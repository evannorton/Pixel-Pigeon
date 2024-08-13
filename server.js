const express = require("express");
const { readFileSync, existsSync } = require("fs");
const http = require("http");
const { join, resolve } = require("path");
const socketio = require("socket.io");

const port = existsSync(join(resolve(), "pp-dev.json")) ? JSON.parse(readFileSync(join(resolve(), "pp-dev.json"))).port : 3000;
const runID = JSON.parse(readFileSync(join(__dirname, "run-id.json")));

import("nanoid").then(({ nanoid }) => {
  const app = express();

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Vary", "Origin");
    express.json()(req, res, next);
  });

  app.use("/", express.static(join(resolve(), "out")));

  const server = new http.Server(app);

  server.listen(port, () => {
    console.log(`Running game server at http://localhost:${port}`);
  });

  const io = new socketio.Server(server, {
    serveClient: false,
  });

  const sockets = new Map();

  io.on("connection", (socket) => {
    sockets.set(socket.id, socket);
  });

  setInterval(() => {
    sockets.forEach((socket) => {
      socket.emit("run-id", runID);
    });
  }, 1000 / 30);
});
