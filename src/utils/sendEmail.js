import { transporter } from "../config/mailTransporter.js";

export const sendEmail = async (to, subject, html) => {
  if (!to || !subject || !html) return "must be provide to & subject & html";

  const transporterRes = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });

  console.log(transporterRes);
};
