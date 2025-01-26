const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

// Counter model
db.counter = require("./counter.model");

db.chat = require("./chat.model");
db.messages = require("./messages.model");
db.chatUsers = require("./chatUsers.model");

module.exports = db;
