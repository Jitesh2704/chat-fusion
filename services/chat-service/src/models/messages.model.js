const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
  message_id: {
    type: Number,
    required: true,
  },
  chat_id: Number,
  sender: Number,
  content: String,
  status: String,
  reply_to: Number,
  type: {
    type: String,
    default: "text",
  },
  files: [String],
  read: [
    {
      user_id: Number,
      timestamp: {
        type: Date,
        default: null,
      },
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

module.exports = mongoose.model("Messages", MessagesSchema);
