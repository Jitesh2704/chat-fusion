// socketio-client.js
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

socket.on("connection", () => {
  console.log("Connected to notification service");
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

function subscribeToNotifications(handleNotification) {
  socket.on("new_notification", (notification) => {
    console.log("Received notification in frontend:", notification);
    handleNotification(notification);
  });
}

// Socket for the custom path
const chatSocket = io("http://localhost:5000", {
  path: "/api/chat",
  transports: ["websocket"],
});

chatSocket.on("connection", () => {
  console.log("Connected to chat service");
});

chatSocket.on("connect_error", (err) => {
  console.error("Chat Socket connection error:", err.message);
});

// Function to subscribe to chat messages
function subscribeToChatMessages(handleMessage, handleUpdateMessage) {
  chatSocket.on("new_message", (message) => {
    console.log("Received chat message in frontend:", message);
    handleMessage(message);
  });

  chatSocket.on("update_message", (updatedMessage) => {
    console.log("Received updated message in frontend:", updatedMessage);
    handleUpdateMessage(updatedMessage);
  });
}

export {
  socket,
  subscribeToNotifications,
  chatSocket,
  subscribeToChatMessages,
};
