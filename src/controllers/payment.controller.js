import { createPaymentIntentService } from "../services/payment.service.js";

export const createPaymentIntent = async (req, res) => {
  const { price } = req.body;

  const data = await createPaymentIntentService(price);

  res.json(data);
};
