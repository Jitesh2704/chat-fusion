const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

// Counter model
db.counter = require("./counter.model"); // Adjust the path as per your directory structure

// Notification-service models
db.notification = require("./notifications.model");


// Add any additional models you have in the same manner

module.exports = db;
