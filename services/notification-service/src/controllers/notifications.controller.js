const db = require("../models");
const Notifications = db.notification;
const {fetchAndUpdateSpecificCounter}= require("../utils/counterUtil"); // Adjust path as needed
const queryUtils = require('../utils/queryUtils');
const { sendNotification } = require("../utils/socketUtil");

exports.findAll = async (req, res) => {
  try {
    const notifications = await queryUtils.paginateAndFilter(Notifications, req);
    res.json(notifications);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving notifications."
    });
  }
};

// Find a single expert program with optional field selection
exports.findOne = async (req, res) => {
  try {
    const fields = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "";

    // Build filter for querying
    const filter = { is_deleted: false };
    const filterFields = req.query.filterFields
      ? JSON.parse(req.query.filterFields)
      : {};

    // Add filterFields to the filter if they exist
    Object.keys(filterFields).forEach((key) => {
      filter[key] = filterFields[key];
    });

    const notification = await Notifications.findOne(filter, fields);

    if (!notification) {
      return res.status(404).send({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Error retrieving notification"
    });
  }
};

// Create a new expert program
exports.create = async (req, res) => {
  try {
    const notificationCounter = await fetchAndUpdateSpecificCounter(
      "notificationCounter",
      "notificationIdCounter"
    );
    const newNotification = new Notifications({
      ...req.body,
      notification_id: notificationCounter,
      is_deleted: false,
      created_by: req.body.created_by,
      cdate_time: new Date().toISOString(),
    });

    // const savedNotififcation = await newNotification.save();
    // res.status(201).send(savedNotififcation);

    // Save the new notification to the database
    const savedNotification = await newNotification.save();

    // Send the notification to the client via Socket.IO
    sendNotification(savedNotification);

    // Respond with the saved notification
    res.status(201).send(savedNotification);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while creating the notififcation.",
    });
  }
};

// Update an existing expert program
exports.update = async (req, res) => {
  try {
    const updateFields = {
      ...req.body,
      modified_by: req.body.id,
      mdate_time: new Date().toISOString(),
    };

    const updatedNotification = await Notifications.findOneAndUpdate(
      { notification_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).send({ message: "Notification not found" });
    }
    res.send(updatedNotification);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Error updating notification with id " + req.params.id,
    });
  }
};

// Delete an expert program (mark as deleted)
exports.delete = async (req, res) => {
  try {
    const updateData = {
      is_deleted: true,
      deleted_by: req.params.deleted_by, // Replace with actual user ID
      ddate_time: new Date().toISOString(),
    };

    const notification = await Notifications.findOneAndUpdate(
      { notification_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!notification) {
      return res.status(404).send({ message: "Notification not found" });
    }
    res.send({ message: "Notification was deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Could not delete notification with id " + req.params.id,
    });
  }
};
