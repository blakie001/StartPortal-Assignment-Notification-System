const amqp = require("amqplib");

let channel, connection;

async function connectRabbitMQ() {
    try {
        connection = await amqp.connect("amqp://localhost");
        channel = await connection.createChannel();
        await channel.assertQueue("notifications", { durable: true });
        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error("RabbitMQ connection failed:", error);
        throw error;
    }
}

async function sendToQueue(message) {
    if (!channel) {
        console.error("Cannot send message, channel not established");
        return;
    }

    try {
        await channel.sendToQueue("notifications", Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log("Message sent to queue:", message);
    } catch (error) {
        console.error("Failed to send message to queue:", error);
    }
}

async function consumeQueue(callback) {
    if (!channel) {
        console.error("Cannot consume message, channel not established");
        return;
    }

    try {
        await channel.consume("notifications", (message) => {
            if (message !== null) {
                const data = JSON.parse(message.content.toString());
                console.log(`Message received from queue: ${JSON.stringify(data)}`);
                callback(data);
                channel.ack(message);
            }
        });
    } catch (error) {
        console.error("Error consuming queue:", error);
    }
}

module.exports = {
    connectRabbitMQ,
    sendToQueue,
    consumeQueue,
};
