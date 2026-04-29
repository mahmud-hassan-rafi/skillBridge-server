import { stripe } from "../config/stripe.js";
import User from "../models/Users.models.js";
import Course from "../models/course/Course.model.js";
import { createEnrollmentService } from "../services/enrollment.service.js";
import { sendEmail } from "../utils/sendEmail.js";

const mailOptions = (user, course, amount, paymentId) => {
  return ` <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Course Enrollment Confirmation</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f5f7fa; font-family: Arial, sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f7fa; padding:30px 0;">
        <tr>
          <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden;">

              <!-- Header -->
              <tr>
                <td align="center" style="background-color:#111827; padding:30px;">
                  <h1 style="margin:0; color:#ffffff; font-size:28px;">
                    Enrollment Confirmed 🎉
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px 35px; color:#374151;">

                  <p style="font-size:16px; margin:0 0 20px;">
                    Hi <strong>${Object.values(user?.fullname).join(" ") || "student"}</strong>,
                  </p>

                  <p style="font-size:15px; line-height:1.8; margin:0 0 20px;">
                    Congratulations! Your payment has been successfully completed and your enrollment has been confirmed.
                  </p>

                  <p style="font-size:15px; line-height:1.8; margin:0 0 30px;">
                    You now have full access to your purchased course and can start learning immediately.
                  </p>

                  <!-- Course Info Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:20px;">
                    <tr>
                      <td style="padding:10px 0;">
                        <strong>Course Name:</strong> ${course?.courseTitle}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;">
                        <strong>Instructor:</strong> ${Object.values(course?.educator?.fullname).join(" ") || "Mahmud Hassan"}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;">
                        <strong>Payment Amount:</strong> ৳${amount}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;">
                        <strong>Transaction ID:</strong> ${paymentId}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;">
                        <strong>Enrollment Date:</strong> ${new Date().toLocaleDateString()}
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:35px;">
                    <tr>
                      <td align="center">
                        <a
                          href="${process.env.FRONTEND_URL}/my-enrollments"
                          style="
                            display:inline-block;
                            background-color:#2563eb;
                            color:#ffffff;
                            text-decoration:none;
                            padding:14px 28px;
                            border-radius:8px;
                            font-size:15px;
                            font-weight:600;
                          "
                        >
                          Start Learning
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; line-height:1.8; margin-top:35px; color:#6b7280;">
                    If you have any questions or face any issues accessing your course, feel free to contact our support team.
                  </p>

                  <p style="font-size:14px; margin-top:30px;">
                    Best regards,<br />
                    <strong>Your Platform Team</strong>
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background-color:#f9fafb; padding:25px; font-size:13px; color:#6b7280;">
                  © ${new Date().getFullYear()} Your Platform. All rights reserved.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    const body =
      typeof req.body === "string" ? req.body : req.body.toString("utf8");

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;

      // Create enrollment
      try {
        const { courseId, userId, price } = paymentIntent.metadata;
        if (courseId && userId) {
          await createEnrollmentService(
            userId,
            courseId,
            price,
            paymentIntent.id,
          );
        } else {
          console.log("⚠️ Missing metadata: courseId or userId");
        }

        const user = await User.findById(userId).lean();
        const course = await Course.findById(courseId)
          .populate({ path: "educator", select: "fullname" })
          .lean();
        console.log(user);
        sendEmail(
          user?.email,
          "Course Enrollment Confirmation 🎉",
          mailOptions(user, course, price, paymentIntent.id),
        );
      } catch (error) {
        console.log(error.message);
      }
      // Enrollment would already be created from payment_intent.succeeded
      break;
  }

  res.json({ received: true });
};
