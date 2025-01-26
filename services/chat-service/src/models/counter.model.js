const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  chat_counter: { type: Number, default: 0 },
  message_counter: { type: Number, default: 0 },
  chatUser_counter: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", CounterSchema);
