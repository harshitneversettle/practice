import { createClient } from "redis";

const subscriber = createClient();

async function main() {
  await subscriber.connect();
  subscriber.subscribe("sports", (msg) => {
    console.log(msg);
  });
}

main();
