import { stripe } from "../config/stripe.js";
import User from "../models/Users.models.js";
import Course from "../models/course/Course.model.js";
import { createEnrollmentService } from "../services/enrollment.service.js";
import { sendEmail } from "../utils/sendEmail.js";

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
        const { courseId, userId } = paymentIntent.metadata;
        if (courseId && userId) {
          await createEnrollmentService(userId, courseId, paymentIntent.id);
        } else {
          console.log("⚠️ Missing metadata: courseId or userId");
        }

        const user = await User.findById(userId).lean();
        const course = await Course.findById(courseId).lean();
        console.log(user);
        sendEmail(
          user?.email,
          `Enrolled Successfull for course ${course?.courseTitle}`,
          `<h1>You are enrolled successfully for course ${course?.courseTitle}!</h1>`,
        );
      } catch (error) {
        console.log(error.message);
      }
      // Enrollment would already be created from payment_intent.succeeded
      break;
  }

  res.json({ received: true });
};
