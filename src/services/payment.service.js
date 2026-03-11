import { stripe } from "../config/stripe.js";

export const createPaymentIntentService = async (price) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: price * 100,
    currency: "usd",
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
};
