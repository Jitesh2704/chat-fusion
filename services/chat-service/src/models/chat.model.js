const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  chat_id: {
    type: Number,
    required: true,
  },
  chat_name: String,
  chat_type: {
    type: String,
    default: "Personal",
  },
  requested_by: Number,
  requested_to: [
    {
      user_id: Number,
      user_type: String,
      chat_status: String,
    },
  ],
  is_deleted: {
    type: Boolean,
    default: false,
  },
  deleted_by: {
    type: Number,
    default: null,
  },
  modified_by: {
    type: Number,
    default: null,
  },
  mdate_time: Date,
  ddate_time: Date,
  created_by: {
    type: Number,
    default: null,
  },
  cdate_time: Date,
});

module.exports = mongoose.model("Chat", ChatSchema);
