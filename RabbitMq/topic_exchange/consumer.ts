import rabbit from "amqplib";
const connection = await rabbit.connect("amqp://localhost");
const channel = await connection.createChannel();

const q1 = await channel.assertQueue("queue1", { durable: true });
const exchangeName = "topic_exchange";
await channel.assertExchange(exchangeName, "topic", { durable: true });
await channel.bindQueue(q1.queue, exchangeName, "order.*", { durable: true });

channel.consume(q1.queue, (msg) => {
  console.log("* -> " ,msg?.content.toString());
});


const q2 = await channel.assertQueue("queue2", { durable: true });
await channel.assertExchange(exchangeName, "topic", { durable: true });
await channel.bindQueue(q2.queue, exchangeName, "#");

channel.consume(q2.queue, (msg) => {
  console.log("# -> ",msg?.content.toString());
});
