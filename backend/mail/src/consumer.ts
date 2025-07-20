import amqp from "amqplib";
import nodemailer from "nodemailer";
import {
  RABBIT_MQ_HOSTNAME,
  RABBIT_MQ_PASSWORD,
  RABBIT_MQ_PORT,
  RABBIT_MQ_USERNAME,
  SMTP_PASS,
  SMTP_USER,
} from "./config/constants.js";

let channel: amqp.Channel;
export const startSendOTPConsumer = async () => {
  try {
    const _connection = await amqp.connect({
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
    const queueName = "send-otp";
    await channel.assertQueue(queueName, { durable: true });
    console.log(
      `🐰 Mail-Service Consumern started, listening for the send otp to emails`
    );
    channel.consume(queueName, async (message) => {
      if (message) {
        try {
          const { to, subject, body } = JSON.parse(message.content.toString());
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: SMTP_USER,
              pass: SMTP_PASS,
            },
          });
          await transporter.sendMail({
            from: "Chatar-Patar-Chat-App",
            to,
            subject,
            text: body,
          });
          console.log(`OTP mail sent to ${to}`);
          channel.ack(message);
        } catch (error) {
          console.log("Failed to send otp by rabbitmq nodemailer", error);
        }
      }
    });
  } catch (error) {
    console.log("Failed to start rabbitmq consumer", error);
    return;
  }
};
