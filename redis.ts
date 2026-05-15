import { createClient } from "redis";

const client = createClient();
await client.connect();
console.log("redis is on");

await client.set("name", "harshit");
console.log(await client.get("name"));

await client.set("otp", "11", {
  EX: 15,
});

const val1 = await client.get("otp");
console.log(val1);

await new Promise((resolve) => {
  setTimeout(resolve, 15000);
});

const val2 = await client.get("otp");
console.log("val2", val2);
