import { transporter } from "../config/mailTransporter.js";

export const sendEmail = async (to, subject, html) => {
  const transporterRes = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to || "amaricancitizen8@gmail.com",
    subject: subject || "Course Enrollment Success",
    html: html || "<h1>You are enrolled successfully!</h1>",
  });

  console.log(transporterRes);
};
