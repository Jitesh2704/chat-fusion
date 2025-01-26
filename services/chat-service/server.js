// require('dotenv').config();
// const app = require('./src/app');


// const PORT = process.env.PORT || 8022;
// app.listen(PORT, () => {
//     console.log(`Chat Service running on port ${PORT}`);
// });


const express = require("express");
const http = require("http");
const app = require("./src/app");
const { initializeSocket } = require("./src/utils/socketUtil");

const PORT = process.env.PORT || 8022;
const server = http.createServer(app);

// Initialize Socket.IO server
initializeSocket(server);

// Socket.IO server logic (if any)
// This can remain as it is, assuming it's necessary for your application

server.listen(PORT, () => {
  console.log(`Chat Service running on port ${PORT}`);
});
