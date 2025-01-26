const db = require("../models");
const ChatUsers = db.chatUsers;
const { fetchAndUpdateSpecificCounter } = require("../utils/counterUtil"); // Adjust path as needed
const queryUtils = require("../utils/queryUtils");

exports.findAll = async (req, res) => {
  try {
    const chatUsers = await queryUtils.paginateAndFilter(ChatUsers, req);
    res.json(chatUsers);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving chatUsers.",
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

    const chatUser = await ChatUsers.findOne(filter, fields);

    if (!chatUser) {
      return res.status(404).send({ message: "ChatUser not found" });
    }
    res.json(chatUser);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving chatUser",
    });
  }
};

// Create a new expert program
exports.create = async (req, res) => {
  try {
    const chatUserCounter = await fetchAndUpdateSpecificCounter(
      "chatsCounter",
      "chatUser_counter"
    );
    const newChatUser = new ChatUsers({
      ...req.body,
      chat_user_id: chatUserCounter,
      created_by: req.body.created_by,
      is_deleted: false,
      cdate_time: new Date().toISOString(),
    });

    const savedChatUser = await newChatUser.save();
    res.status(201).send(savedChatUser);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the chatUser.",
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

    const updatedChatUser = await ChatUsers.findOneAndUpdate(
      { chat_user_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedChatUser) {
      return res.status(404).send({ message: "ChatUsers not found" });
    }
    res.send(updatedChatUser);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error updating chatUser with id " + req.params.id,
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

    const chatUser = await ChatUsers.findOneAndUpdate(
      { chat_user_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!chatUser) {
      return res.status(404).send({ message: "chatUser not found" });
    }
    res.send({ message: "chatUser was deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Could not delete chatUser with id " + req.params.id,
    });
  }
};
