const rabbit = require("amqplib");
const connection = await rabbit.connect("amqp://localhost");
const channel = await connection.createChannel();

const queueName = "task1" ;
await channel.assertQueue(queueName , {durable : true});

await channel.consume(queueName , (msg  : any) => {
    console.log(msg.content.toString())
})
