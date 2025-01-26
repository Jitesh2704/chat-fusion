const express = require("express");
const router = express.Router();
const chatUsersController = require("../controllers/chatUser.controller"); // Update the path as per your directory structure

router.get("/getAllChatUsers", chatUsersController.findAll);
router.get("/getChatUser", chatUsersController.findOne);
router.post("/createChatUser", chatUsersController.create);
router.put("/updateChatUser/:id", chatUsersController.update);
router.delete("/deleteChatUser/:id/:deleted_by", chatUsersController.delete);

module.exports = router;
