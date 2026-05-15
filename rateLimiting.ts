import { createClient } from "redis";

const express = require("express");
const client = createClient();
await client.connect();
const app = express();

async function rateLimiter(ip: any) {
  const key = `rate:${ip}`;
  const req = await client.incr(key);
  if (req === 1) {
    client.expire(key, 60);
  }

  if (req > 5) {
    return {
      message: "Too many requests",
    };
  }
}
app.get("/", async (req: any, res: any) => {
  const ip = req.ip;

  const response = await rateLimiter(ip);
  response ? res.send(response) : res.send("connected");
});

app.listen(3000);
