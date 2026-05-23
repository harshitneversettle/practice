process.env.KAFKAJS_NO_PARTITIONER_WARNING = "1";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "new_app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

await producer.connect();
await producer.send({
  topic: "first_topic",
  messages: [
    {
      key: "name",
      value: "Harshit",
    },
  ],
});

console.log("message sent");
await producer.disconnect();
