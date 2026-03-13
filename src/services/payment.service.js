import { stripe } from "../config/stripe.js";

export const createPaymentIntentService = async (courseId, price) => {
  console.log(courseId);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(price * 100),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      courseId,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
};
