import { createPaymentIntentService } from "../services/payment.service.js";

export const createPaymentIntent = async (req, res) => {
  const { price } = req.body;

  const data = await createPaymentIntentService(price);

  res.json(data);
};

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "React Mastery Course",
          },
          unit_amount: 6799,
        },
        quantity: 1,
      },
    ],

    mode: "payment",

    success_url: "http://localhost:5173/payment-success",
    cancel_url: "http://localhost:5173/payment-cancel",
  });

  res.json({ url: session.url });
};
