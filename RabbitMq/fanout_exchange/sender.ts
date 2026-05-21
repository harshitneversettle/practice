const rabbit = require("amqplib");
const connection = await rabbit.connect("amqp://localhost");

const channel = await connection.createChannel();
const queueName = "fanout_exchange_task";
const exchangeName1 = "exchange_name_fanout";
const routingKey = "task1";

await channel.assertQueue(queueName);
await channel.assertExchange(exchangeName1, "fanout", { durable: false });

// await channel.bindQueue(queueName, exchangeName1, routingKey);
// no need of binding in the sender side 

// await channel.sendToQueue(
//   queueName,
//   Buffer.from("hello this is a message using direct exchange "),
// );    // while using exchanges , sendToQueue is not used

await channel.publish(
  exchangeName1,
  routingKey,
  Buffer.from("hello this is a message using fanout exchange "),
); 

console.log("message sent");
