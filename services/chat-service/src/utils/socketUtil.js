const { Server: SocketIOServer } = require("socket.io");

let io;
// let chatNamespace; // Define a separate namespace for chat messages

function initializeSocket(server) {
  console.log("Initializing Socket.IO server...");
  io = new SocketIOServer(server, {
    path: "/api/chat",
    cors: {
      origin: "*",
    },
    // Additional options if needed
  });

  io.on("connection", (socket) => {
    console.log("Chat Client connected:", socket.id);

    // Example event handler
    socket.on("disconnect", () => {
      console.log("Chat Client disconnected:", socket.id);
    });
  });


  console.log("Socket server initialized and ready to accept connections.");
}

function sendMessage(message) {
  console.log("in server side", message);
  io.emit("new_message", message); // Broadcast to all connected clients in the default namespace
}


const updateMessage = (updatedMessage) => {
  io.emit("update_message", updatedMessage);
};

module.exports = {
  initializeSocket,
  sendMessage,
  updateMessage,
};


// const { Server: SocketIOServer } = require("socket.io");

// let io;

// function initializeSocket(server) {
//   console.log("Initializing Socket.IO server...");
//   io = new SocketIOServer(server, {
//     cors: {
//       origin: "*",
//     },
//     // Additional options if needed
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

// function sendMessage(message) {
//   console.log("in server side", message);
//   io.emit("new_message", message);
// }

// module.exports = {
//   initializeSocket,
//   sendMessage,
// };
