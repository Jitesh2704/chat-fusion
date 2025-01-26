const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  notification_id: Number,
  notification_type: String,
  user_id: Number,
  is_read: Boolean,
  notification_body: String,
  priority: String,
  content_type: String,
  notification_image: String,
  is_interactable: { type: Boolean, default: false },
  reject_button: {
    method: String,
    url: String,
    data: Object,
  },
  accept_button: {
    method: String,
    url: String,
    data: Object,
  },
  content_id: Number,
  license_id: Number,
  is_deleted: { type: Boolean, default: false },
  deleted_by: { type: Number, default: null },
  modified_by: { type: Number, default: null },
  mdate_time: { type: Date },
  ddate_time: { type: Date },
  created_by: { type: Number, default: null },
  cdate_time: { type: Date },
});

module.exports = mongoose.model("Notification", NotificationSchema);
