// ensure dotenv has run even if stripe.js is imported early
import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
