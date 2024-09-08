const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");


router.get("/profile", verifyToken, userController.getUserProfile);

exports.router = router;