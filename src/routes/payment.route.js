import express from "express";
import { createPaymentIntent } from "../controllers/payment.controller.js";
import { stripeWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/webhook", stripeWebhook);

export default router;
