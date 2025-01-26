const mongoose = require("mongoose");

const ChatUsersSchema = new mongoose.Schema({
  chat_user_id: {
    type: Number,
    required: true,
  },
  chat_id: Number,
  user_id: Number,
  user_type: String,
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

module.exports = mongoose.model("ChatUsers", ChatUsersSchema);
