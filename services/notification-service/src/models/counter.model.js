const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  notificationIdCounter: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", CounterSchema);
