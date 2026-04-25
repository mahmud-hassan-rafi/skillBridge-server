// import { stripe } from "../config/stripe.js";

export const stripeWebhook = async (req, res) => {
  const event = req.body;
  console.log(event);

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    const courseId = paymentIntent.metadata.courseId;

    console.log("Payment success for course:", courseId);

    sendEmail();
    // এখানে enrollment create হবে
  }

  res.json({ received: true });
};
