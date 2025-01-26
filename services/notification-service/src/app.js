const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const { ensureCounterExists } = require("./utils/counterUtil"); // Adjust the path as necessary

// Route imports
const notificationsRoutes = require("./routes/notifications.routes");

const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const username = process.env.MONGO_INITDB_ROOT_USERNAME;
const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const dbName = process.env.MONGO_DB_NAME;

const primaryDbUri = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
const fallbackDbUri = `${process.env.MONGODB_URI}/${dbName}`;

const connectWithFallback = async () => {
  try {
    await mongoose.connect(primaryDbUri);
    console.log("Connected to primary MongoDB");
    initializeApp();
  } catch (err) {
    console.error(`Primary MongoDB connection error: ${err}`);
    console.log("Attempting to connect to fallback MongoDB");
    try {
      await mongoose.connect(fallbackDbUri);
      console.log("Connected to fallback MongoDB");
      initializeApp();
    } catch (fallbackErr) {
      console.error(`Fallback MongoDB connection error: ${fallbackErr}`);
    }
  }
};
connectWithFallback();

// When the server starts
async function initializeApp() {
  await ensureCounterExists("notificationCounter");
}

// Use Routes
app.use("/notifications", notificationsRoutes);

module.exports = app;
