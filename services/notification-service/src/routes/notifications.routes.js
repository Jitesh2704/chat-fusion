const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notifications.controller"); // Update the path as per your directory structure

// Define the routes for the Expert Program entity
router.get("/getAllNotifications", notificationController.findAll);
router.get("/getNotification", notificationController.findOne);
router.post("/createNotification", notificationController.create);
router.put("/updateNotification/:id", notificationController.update);
router.delete("/deleteNotification/:id/:deleted_by", notificationController.delete);
router.get("/", () => { return "You are in Notification Service"})

module.exports = router;