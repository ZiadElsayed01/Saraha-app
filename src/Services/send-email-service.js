import nodemailer from "nodemailer";
import { EventEmitter } from "node:events";

const SendEmailServices = async ({ to, subject, html, attachments = [] }) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transport.sendMail({
      from: `Saraha-app" <${process.env.EMAIL}>`,
      to,
      subject,
      html,
      attachments,
    });
    return info;
  } catch (error) {
    console.log("Error in sending email", error);
    return error;
  }
};

export const emitter = new EventEmitter();
emitter.on("SendEmail", (...arg) => {
  const { to, subject, html, attachments } = arg[0];
  SendEmailServices({
    to,
    subject,
    html,
    attachments,
  });
});
