const { Server: SocketIOServer } = require("socket.io");

let io;

function initializeSocket(server) {
  console.log("Initializing Socket.IO server...");
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
    // Additional options if needed
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Example event handler
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  console.log("Socket server initialized and ready to accept connections.");
}

function sendNotification(notification) {
  console.log("in server side", notification);
  io.emit("new_notification", notification);
}

module.exports = {
  initializeSocket,
  sendNotification,
};

// // src/utils/socketUtil.js
// const { Server: SocketIOServer } = require("socket.io");

// let io;

// function initializeSocket(server) {
//   console.log("this is recieved server", server);
//   io = new SocketIOServer(server, {
//     cors: {
//       origin: "*",
//     },
//     // path: "/socket.io",
//   });

//   io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);

//     // Example event handler
//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//   });

//   console.log("Socket server initialized and ready to accept connections.");
// }

// function sendNotification(notification) {
//   io.emit("new_notification", notification);
// }

// module.exports = {
//   initializeSocket,
//   sendNotification,
// };
