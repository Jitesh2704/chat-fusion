const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();
const authRoutes = require('./routes/auth.routes');
const {ensureCounterExists} = require('./utils/fetchAndUpdateCounter')

const app = express()

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbName = process.env.MONGO_DB_NAME;
const fallbackDbUri = `${process.env.MONGODB_URI}/${dbName}`;

const connectWithFallback = async () => {
    try {
      console.log("Attempting to connect to Auth  MongoDB");
      await mongoose.connect(fallbackDbUri);
      console.log('Connected to Auth MongoDB');
      initializeApp() 
    } catch (fallbackErr) {
      console.error(`MongoDB Auth connection error: ${fallbackErr}`);
    }
};

connectWithFallback()

async function initializeApp() {
  await ensureCounterExists('authCounter'); 
}

app.use('/', authRoutes);

module.exports = app;
