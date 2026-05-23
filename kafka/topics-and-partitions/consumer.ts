import { resolve } from "bun";
import { Kafka } from "kafkajs";
const kafka = new Kafka({
  clientId: "consuer_clientId",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "grp1" });
await consumer.connect();

await consumer.subscribe({
  topic: "orders",
  fromBeginning: true,
});

let track: Record<number, number> = { 0: 0, 1: 0, 2: 0 };

await consumer.run({
  eachMessage: async ({ topic, message, partition }) => {
    console.log({
      key: message.key?.toString(),
      value: message.value?.toString(),
      partition,
      offset : message.offset
    });
    track[partition]!++;
  },
});

await new Promise((resolve) => setTimeout(resolve, 15000));

await consumer.disconnect();
console.log(track);
