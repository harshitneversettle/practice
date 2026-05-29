import { createClient } from "redis";

export const publisher = createClient();
export const consumer = createClient();

export async function setConnection() {
  await publisher.connect();
  await consumer.connect() ;
}
