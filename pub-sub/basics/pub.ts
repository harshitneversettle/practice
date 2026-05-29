import { createClient } from "redis";

const publisher = createClient();

async function main() {
  await publisher.connect();
  await publisher.publish("sports" , "hii this is ipl season 2026")
  console.log("message sent") ;
}

main() ;
