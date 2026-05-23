import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "topics_intro",
  brokers: ["localhost:9092"],
});

const admin = kafka.admin();

await admin.connect();
await admin.createTopics({
  topics: [
    {
      topic: "orders",
      numPartitions: 3,
    },
  ],
});

console.log("order topic is created here ");

await admin.disconnect();
// here the topic is created , hence the admin can be disconnected

const producer = kafka.producer();
await producer.connect();

const data = [
  { key: "user-1", value: "pizza" },
  { key: "user-1", value: "burger" },
  { key: "user-2", value: "pasta" },
  { key: "user-2", value: "sandwich" },
  { key: "user-3", value: "momos" },
  { key: "user-4", value: "biryani" },
  { key: "user-1", value: "fries" },
  { key: "user-3", value: "shawarma" },
  { key: "user-2", value: "cold coffee" },
  { key: "user-5", value: "paneer roll" },
  { key: "user-6", value: "dosa" },
  { key: "user-7", value: "idli" },
  { key: "user-8", value: "vada" },
];

for (const i of data) {
  const metadata = await producer.send({
    topic: "orders",
    messages: [i],
  });
  // metadata is array with a single value , metadata[0]
  console.log({
    key: i.key,
    partition: metadata[0]?.partition,
    offset: metadata[0]?.baseOffset,
  });
}

await producer.disconnect();
