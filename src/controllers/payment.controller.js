import { createPaymentIntentService } from "../services/payment.service.js";

export const createPaymentIntent = async (req, res) => {
  const { courseId, price } = req.body;
  console.log(price, courseId);

  const data = await createPaymentIntentService(courseId, price);

  res.json(data);
};
