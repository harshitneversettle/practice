import rabbit from "amqplib";
const connection = await rabbit.connect("amqp://localhost");
const channel = await connection.createChannel();

// const q1 = await channel.assertQueue("queue1", { durable: false });
// no need of queue 1 on sender/producer side

const exchangeName = "topic_exchange";
await channel.assertExchange(exchangeName, "topic", { durable: true });

channel.publish(
  exchangeName,
  "order.details",
  Buffer.from(JSON.stringify({ order: "oil", price: "300" })),
);
channel.publish(
  exchangeName,
  "order.address",
  Buffer.from(JSON.stringify({ address: null })),
);
channel.publish(
  exchangeName,
  "customer.details",
  Buffer.from(
    JSON.stringify({ name: "harshit", email: "harshityadav@gmail.com" }),
  ),
);

console.log("message sent") ;