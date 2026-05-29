import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import { consumer, publisher, setConnection } from "./redis";

const app = express();
const port = 3001; // change to simulate
const wsport = 8081; // server side connection

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  }),
);

app.get("/", (_req, res) => {
  res.send("hello");
});

const wss = new WebSocketServer({ port: wsport });
const clients = new Set<WebSocket>();

setConnection();
consumer.subscribe("chat-app", (msg) => {
  // this is the message of another server received through the pubsub
  // now someone from some server sent a message
  // since all the servers have the same server.ts => as the thread proceeds , thisd piece of code
  // gets hit and a new consumer is created everytime the script runs => 2 servers = 2 consumers
  // now since we have a listner of the pub-sub , if a event come , somehow find all the clients of this
  // particular server and propagate the incoming messsage to all => the clients of a particular server are in the
  // set created

  clients.forEach((i) => {
    // i == websocket
    if (i.readyState === WebSocket.OPEN) {
      i.send(msg.toString());
    }
  });
});

wss.on("connection", (ws) => {
  // ws => incoming connection form fronetend
  clients.add(ws);
  console.log("new user joined ");
  ws.on("message", async (msg) => {
    // first publish it
    publisher.publish("chat-app", msg.toString());

    // this is removed because 2 baar messages ja rhe the , 1 baar through websockets , 1 baaar through pub-sub 
    // then propagate the message to all hte clients present in the respective server
    // clients.forEach((i) => {
    //   if (i != ws) {
    //     i.send(msg);
    //   }
    // });
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log(" a user disconnected");
  });
});

app.post("/api/messages", (req, res) => {
  const { message } = req.body;
  console.log(message);
  res.send("ok");
});

app.listen(port, () => {
  console.log(`running at port ${port} ans ws on ${wsport}`);
});
