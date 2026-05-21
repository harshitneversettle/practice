const rabbit = require("amqplib");
const connection = await rabbit.connect("amqp://localhost");

const channel = await connection.createChannel();
const queueName = "fanout_exchange_task";
const exchangeName1 = "exchange_name_fanout";
const routingKey = "task1";

const queueName2 = "fanout_exchange_task2";
await channel.assertQueue(queueName);
await channel.assertQueue(queueName2);

await channel.assertExchange(exchangeName1, "fanout", { durable: false });

await channel.bindQueue(queueName, exchangeName1, routingKey);
await channel.bindQueue(queueName2, exchangeName1, routingKey);

// in fanout exchange , the eouting kry is ignored , that's why we can leave it as "" only
// the order or running should be first consumer then the sender 

await channel.consume(queueName, (msg: any) => {
  console.log(msg.content.toString());
  console.log("queue 1");
});

await channel.consume(queueName2, (msg: any) => {
  console.log(msg.content.toString());
  console.log("queue 2");
});
