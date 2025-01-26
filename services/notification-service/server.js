const express = require("express");
const http = require("http");
const app = require("./src/app");
const { initializeSocket } = require("./src/utils/socketUtil");

const PORT = process.env.PORT || 8004;
const server = http.createServer(app);

// Initialize Socket.IO server
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});










