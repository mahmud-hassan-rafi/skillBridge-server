import express from "express";
import { createPaymentIntent } from "../controllers/payment.controller.js";
import { stripeWebhook } from "../controllers/webhook.controller.js";
import { isAuthenticatedMiddlewares } from "../middlewares/Auth.middleware.js";

const router = express.Router();

router.post(
  "/create-payment-intent",
  express.json(),
  isAuthenticatedMiddlewares,
  createPaymentIntent,
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

export default router;
