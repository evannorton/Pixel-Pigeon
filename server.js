const express = require("express");
const { readFileSync } = require("fs");
const http = require("http");
const { join } = require("path");
const socketio = require("socket.io");

console.log("Running game server.");

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

  app.use("/", express.static(join(__dirname, "out")));

  const server = new http.Server(app);

  server.listen(3000);

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
