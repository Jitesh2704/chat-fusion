const express = require("express");
const router = express.Router();
const chatsController = require("../controllers/chat.controller"); // Update the path as per your directory structure

router.get("/getAllChats", chatsController.findAll);
router.get("/getChat", chatsController.findOne);
router.post("/createChat", chatsController.create);
router.put("/updateChat/:id", chatsController.update);
router.delete("/deleteChat/:id/:deleted_by", chatsController.delete);

module.exports = router;