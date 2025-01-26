const mongoose = require("mongoose");

const AuthUserSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  fname: String,
  lname: String,
  username: String,
  email: String,
  password: String,
  profile_image: {
    type: String,
    default: null,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  cdate_time: {
    type: Date,
  },
  created_by: {
    type: Number,
    default: null,
  },
  mdate_time: {
    type: Date,
  },
  modified_by: {
    type: Number,
    default: null,
  },
  ddate_time: {
    type: Date,
  },
  deleted_by: {
    type: Number,
  },
});

module.exports = mongoose.model("User", AuthUserSchema);
