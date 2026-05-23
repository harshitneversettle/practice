process.env.KAFKAJS_NO_PARTITIONER_WARNING = "1";
import { Kafka } from "kafkajs";
const kafka = new Kafka({
  clientId: "new_app",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "test-group" });

await consumer.connect();

await consumer.subscribe({
  topic: "first_topic",
  fromBeginning: true,
});

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({ topic, partition, value: message.value?.toString() });
  },
});

// consumer.run() a continouspooloing loop -> keep asking for any new ,messages , runs forever until stopped intentonally 

