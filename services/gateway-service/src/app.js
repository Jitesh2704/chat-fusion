const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const routes = require("./routes/gateway.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.json({ limit: "100mb" }));

// API Gateway routes
app.use("/api", routes);

// Proxy middleware for WebSocket and other HTTP services
const chatProxy = createProxyMiddleware("/api/chat", {
  target: "http://chat:8022", // Your backend server URL
  ws: true, // Enable WebSocket proxying
  changeOrigin: true,
  pathRewrite: {
    "^/api/chat": "/api/chat",
  },
});

// Use the proxy middleware
app.use(chatProxy);

// Proxy middleware for WebSocket and other HTTP services
const notificationProxy = createProxyMiddleware("/socket.io", {
  target: "http://notification:8004",
  ws: true,
  changeOrigin: true,
});

app.use(notificationProxy);

module.exports = app;
