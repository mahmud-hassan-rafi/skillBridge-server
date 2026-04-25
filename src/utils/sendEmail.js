import { transporter } from "../config/mailTransporter.js";

export const sendEmail = async () => {
  const transporterRes = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "amaricancitizen8@gmail.com",
    subject: "Course Enrollment Success",
    html: "<h1>You are enrolled successfully!</h1>",
  });

  console.log(transporterRes);
};
