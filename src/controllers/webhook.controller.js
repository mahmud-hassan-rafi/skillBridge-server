import { stripe } from "../config/stripe.js";
import connectToDB from "../config/db.js";
import {
  createEnrollmentService,
  cancelEnrollmentService,
} from "../services/enrollment.service.js";

export const stripeWebhook = async (req, res) => {
  console.log("touching stripe webhook ()");
  const sig = req.headers["stripe-signature"];

  console.log("🔔 Webhook received");
  console.log("Signature:", sig ? "✅ Present" : "❌ Missing");
  console.log("Body length:", req.body?.length || 0);
  console.log(
    "Secret:",
    process.env.STRIPE_WEBHOOK_SECRET ? "✅ Present" : "❌ Missing",
  );

  let event;

  try {
    // Convert Buffer to string if needed
    const body =
      typeof req.body === "string" ? req.body : req.body.toString("utf8");

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log(event);

    console.log("✅ Event verified:", event.type);
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case "payment_intent.succeeded":
      console.log("💰 Payment succeeded!");
      const paymentIntent = event.data.object;
      console.log("Payment ID:", paymentIntent.id);
      console.log("Amount:", paymentIntent.amount);
      console.log("Metadata:", paymentIntent.metadata);

      // Create enrollment
      try {
        const { courseId, userId } = paymentIntent.metadata;
        if (courseId && userId) {
          await createEnrollmentService(userId, courseId, paymentIntent.id);
        } else {
          console.log("⚠️ Missing metadata: courseId or userId");
        }
      } catch (error) {
        console.error("❌ Enrollment creation failed:", error.message);
      }
      // Enrollment would already be created from payment_intent.succeeded
      break;

    case "payment_intent.created":
      console.log("📝 Payment intent created (ignoring)");
      break;

    case "charge.updated":
      console.log("🔄 Charge updated");
      const updatedCharge = event.data.object;
      console.log("Charge ID:", updatedCharge.id);
      console.log("Status:", updatedCharge.status);
      break;

    case "payment_intent.payment_failed":
      console.log("❌ Payment failed:", event.data.object.last_payment_error);
      break;

    case "charge.refunded":
      console.log("💸 Refund processed");
      const refundedCharge = event.data.object;
      console.log("Amount refunded:", refundedCharge.amount_refunded);

      // Cancel enrollment on refund
      try {
        // Get payment intent details to extract metadata
        const paymentIntentId = refundedCharge.payment_intent;
        if (paymentIntentId) {
          const paymentIntent =
            await stripe.paymentIntents.retrieve(paymentIntentId);
          const { courseId, userId } = paymentIntent.metadata;

          if (courseId && userId) {
            await cancelEnrollmentService(userId, courseId);
          }
        }
      } catch (error) {
        console.error("❌ Enrollment cancellation failed:", error.message);
      }
      break;

    default:
      console.log("⚠️ Unhandled event type:", event.type);
  }

  res.json({ received: true });
};
