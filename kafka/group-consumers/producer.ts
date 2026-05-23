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

// wait 10 seconds for all consumers to join and get assigned partitions
await new Promise(r => setTimeout(r, 10000));

const producer = kafka.producer();
await producer.connect();

const data = [
  { key: "user-1", value: "pizza" },
  { key: "user-2", value: "burger" },
  { key: "user-3", value: "pasta" },
  { key: "user-4", value: "momos" },
  { key: "user-5", value: "biryani" },
  { key: "user-6", value: "dosa" },
  { key: "user-7", value: "idli" },
  { key: "user-8", value: "shawarma" },
];

for (const i of data) {
  const metadata = await producer.send({
    topic: "orders",
    messages: [{ key: i.key, value: i.value }],
  });
  // metadata is array with a single value , metadata[0]

  const partition = metadata[0]!.partition;
  console.log(`key="${i.key}" -> P${partition} | ${i.value}`);

  await new Promise((resolve) => setTimeout(resolve, 2000));
}

await producer.disconnect();
