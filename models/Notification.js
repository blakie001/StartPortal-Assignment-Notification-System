const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
    },
    read: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model("Notification", notificationSchema);