const db = require("../models");
const Chat = db.chat;
const { fetchAndUpdateSpecificCounter } = require("../utils/counterUtil"); // Adjust path as needed
const queryUtils = require("../utils/queryUtils");

exports.findAll = async (req, res) => {
  try {
    const chats = await queryUtils.paginateAndFilter(Chat, req);
    res.json(chats);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving chats.",
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

    const chat = await Chat.findOne(filter, fields);

    if (!chat) {
      return res.status(404).send({ message: "Chat not found" });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving chat",
    });
  }
};

// Create a new expert program
exports.create = async (req, res) => {
  try {
    const chatCounter = await fetchAndUpdateSpecificCounter(
      "chatsCounter",
      "chat_counter"
    );
    const newChat = new Chat({
      ...req.body,
      chat_id: chatCounter,
      created_by: req.body.created_by,
      is_deleted: false,
      cdate_time: new Date().toISOString(),
    });

    const savedChat = await newChat.save();
    res.status(201).send(savedChat);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the chat.",
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

    const updatedChat = await Chat.findOneAndUpdate(
      { chat_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).send({ message: "Chat not found" });
    }
    res.send(updatedChat);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Error updating chat with id " + req.params.id,
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

    const chat = await Chat.findOneAndUpdate(
      { chat_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!chat) {
      return res.status(404).send({ message: "chat not found" });
    }
    res.send({ message: "chat was deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Could not delete chat with id " + req.params.id,
    });
  }
};
