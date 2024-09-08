const express = require("express");
const dotenv = require("dotenv");
const { connectDb } = require("./config/dbConnection");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { connectRabbitMQ, consumeQueue, sendToQueue } = require('./utils/rabbitmq');

const server = express();
server.use(express.json());
server.use(cors());
dotenv.config();
connectDb();

const client = http.createServer(server);
const io = socketIo(client, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// Import your controllers
const { setSocketIoInstance } = require("./controller/notification.controller");

// Seting the Socketio instance to be used in controllers
setSocketIoInstance(io);

let notifications = [];

io.on("connection", (socket) => {
    console.log("New User Connected");

    // Send existing notifications
    socket.emit("InitialNotifications", notifications);

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
});

// queu:
consumeQueue((data) => {
    io.emit("newNotifications", data);  // Emit the notification to all connected users
});
connectRabbitMQ();


// Routes
const authRoutes = require("./routes/auth.routes");
const notificationRoutes = require("./routes/notification.routes");


server.use(authRoutes.router);
server.use(notificationRoutes.router);

client.listen(3000, () => {
    console.log("Server and Socket.IO are running");
});
