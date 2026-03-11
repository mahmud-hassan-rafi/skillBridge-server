import express from "express";
import {
  createCheckoutSession,
  createPaymentIntent,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/create-checkout-session", createCheckoutSession);

export default router;
