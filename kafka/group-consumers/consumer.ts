import { Kafka } from "kafkajs";

process.env.KAFKAJS_NO_PARTITIONER_WARNING = "1";

// pass consumer name as CLI arg: bun consumer-group.ts C1
const consumerName = process.argv[2] ?? "C1";

const kafka = new Kafka({
  clientId: `consumer-${consumerName}`,
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "grp1" });

await consumer.connect();
await consumer.subscribe({ topic: "orders", fromBeginning: false });

console.log(
  `[${consumerName}] joined group "grp1"\n`,
);

await consumer.run({
  eachMessage: async ({ partition, message }) => {
    const key = message.key?.toString();
    const value = message.value?.toString();
    const offset = message.offset;

    console.log({consumerName : `P${partition}` , offset , key , value})
  },
});

