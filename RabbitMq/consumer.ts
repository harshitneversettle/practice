const rabbit = require("amqplib");
const connection = await rabbit.connect("amqp://localhost");
const channel = await connection.createChannel();
await channel.assertQueue();

const queueName = "task1" ;

await channel.consume(queueName , (msg  : any) => {
    console.log(msg.content.toString())
})
