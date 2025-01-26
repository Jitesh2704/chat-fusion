const db = require("../models");
const Messages = db.messages;
const { fetchAndUpdateSpecificCounter } = require("../utils/counterUtil"); // Adjust path as needed
const queryUtils = require("../utils/queryUtils");
const { sendMessage } = require("../utils/socketUtil");
const { updateMessage } = require("../utils/socketUtil");

exports.findAll = async (req, res) => {
  try {
    const messages = await queryUtils.paginateAndFilter(Messages, req);
    res.json(messages);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving messages.",
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

    const message = await Messages.findOne(filter, fields);

    if (!message) {
      return res.status(404).send({ message: "message not found" });
    }
    res.json(message);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving message",
    });
  }
};

// Create a new expert program
exports.create = async (req, res) => {
  try {
    const messageCounter = await fetchAndUpdateSpecificCounter(
      "chatsCounter",
      "message_counter"
    );
    const newMessage = new Messages({
      ...req.body,
      message_id: messageCounter,
      created_by: req.body.created_by,
      is_deleted: false,
      cdate_time: new Date().toISOString(),
    });

    const savedMessage = await newMessage.save();

    sendMessage(savedMessage);

    res.status(201).send(savedMessage);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the message.",
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

    const updatedMessage = await Messages.findOneAndUpdate(
      { message_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).send({ message: "Messages not found" });
    }

    updateMessage(updatedMessage);
    res.send(updatedMessage);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Error updating message with id " + req.params.id,
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

    const message = await Messages.findOneAndUpdate(
      { message_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!message) {
      return res.status(404).send({ message: "message not found" });
    }
    res.send({ message: "message was deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Could not delete message with id " + req.params.id,
    });
  }
};
