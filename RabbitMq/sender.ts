const rabbit = require("amqplib");
const connection = await rabbit.connect("amqp://localhost");
const channel = await connection.createChannel();
const queueName = "task1";
await channel.assertQueue(queueName, { duration: true });
const msg = {
  name: "harshit",
};

const buffer = Buffer.from(JSON.stringify(msg));

await channel.sendToQueue(queueName, buffer);

console.log("message gaya");
