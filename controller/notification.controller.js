const Notification = require("../models/Notification");
const User = require("../models/User");

let io; // Declare io globally

//send notification to que: 
const { sendToQueue } = require("../utils/rabbitmq");

exports.setSocketIoInstance = (socketIoInstance) => {
    io = socketIoInstance;
};

exports.sendNotification = async (req, res) => {
    try {
        const email = req.body.email;
        const receiver = await User.findOne({ email });
        if (!receiver) return res.status(404).json("User Not found");

        const notification = new Notification({
            userId: receiver._id,
            message: req.body.message,
        });
        await notification.save();

        // Emit the new notification to all clients in real-time | socketio
        io.emit("newNotifications", {
            userId: receiver._id,
            message: req.body.message,
        });

        // Send the notification to queue
        sendToQueue(JSON.stringify({ message: req.body.message, email }));

        return res.status(200).json("Notification Sent");
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
};

exports.getAllNotifications = async(req, res) =>{
    try {
        const allNotifications = await Notification.find({ userId: res.userId});
        return res.status(200).json(allNotifications);
    } catch (error) {
        console.log(error);
        return res.status(500).json("Interval Server Error");
    }
}


exports.getSingleNotification = async(req, res) =>{
    try {
        const singleNotification = await Notification.findById(req.params.id);
        if(!singleNotification) return res.status(404).json("Notification Not Found");        
        return res.status(200).json(singleNotification);
    } catch (error) {
        console.log(error);
        return res.status(500).json("Interval Server Error");
    }
}

exports.readNotification = async(req, res) =>{
    try {
        await Notification.findByIdAndUpdate(req.params.id, {read: true});

        return res.status(204).json({});
    } catch (error) {
        console.log(error);
        return res.status(500).json("Interval Server Error");
    }
}