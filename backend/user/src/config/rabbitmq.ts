import ampq from "amqplib";
import {
  RABBIT_MQ_HOSTNAME,
  RABBIT_MQ_PASSWORD,
  RABBIT_MQ_PORT,
  RABBIT_MQ_USERNAME,
} from "./constants.js";

let channel: ampq.Channel;

export const connectRabbitMQ = async () => {
  try {
    const _connection = await ampq.connect({
      protocol: "amqp",
      hostname: RABBIT_MQ_HOSTNAME,
      port:
        typeof RABBIT_MQ_PORT === "string"
          ? parseInt(RABBIT_MQ_PORT, 10)
          : RABBIT_MQ_PORT || 5672,
      username: RABBIT_MQ_USERNAME,
      password: RABBIT_MQ_PASSWORD,
    });
    channel = await _connection.createChannel();
    console.log(`🐰 connected to rabbit mq`);
  } catch (error) {
    console.log("Error in connection of rabbitmq", error);
  }
};

export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.log("Rabbitmq channel is not initialized");
    return;
  }
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};
