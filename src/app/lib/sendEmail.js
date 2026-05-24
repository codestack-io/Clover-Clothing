import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Clover-Clothing" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return info;
  } catch (error) {
    console.log(error);
    throw new Error("Email sending failed");
  }
};