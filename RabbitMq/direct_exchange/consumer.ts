const rabbit = require("amqplib");
const connection = await rabbit.connect("amqp://localhost");

const channel = await connection.createChannel();
const queueName = "direct_exchange_task";
const exchangeName1 = "exchange_name_direct";
const routingKey = "task1";

await channel.assertQueue(queueName);
await channel.assertExchange(exchangeName1, "direct", { durable: false });

await channel.bindQueue(queueName , exchangeName1 , routingKey) ;
await channel.consume(queueName, (msg: any) => {
  console.log(msg.content.toString());
  console.log(msg.fields.exchange)
});
