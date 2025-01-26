const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messages.controller"); // Update the path as per your directory structure

router.get("/getAllMessages", messageController.findAll);
router.get("/getMessage", messageController.findOne);
router.post("/createMessage", messageController.create);
router.put("/updateMessage/:id", messageController.update);
router.delete("/deleteMessage/:id/:deleted_by", messageController.delete);

module.exports = router;
