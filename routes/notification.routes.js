const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notification.controller");
const {verifyToken} = require("../middlewares/auth.middleware")

router.post("/notifications", verifyToken, notificationController.sendNotification);

//get all notification;
router.get("/notifications", verifyToken, notificationController.getAllNotifications);

// get single 

router.get("/notifications/:id", verifyToken, notificationController.getSingleNotification);

//read notification
router.put("/notifications/:id", verifyToken, notificationController.readNotification);

exports.router = router;