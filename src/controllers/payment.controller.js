import { createPaymentIntentService } from "../services/payment.service.js";

export const createPaymentIntent = async (req, res) => {
  try {
    console.log(req.user);
    console.log(typeof req.user?._id);
    console.log(String(req.user._id));
    console.log(req.user._id.toString());

    const { courseId, price } = req.body;
    const user = req.user; // Get from authenticated request
    console.log(courseId);
    const data = await createPaymentIntentService(courseId, price, user._id);

    res.status(200).json(data);
  } catch (error) {
    console.error("Payment Intent Error:", error);
    res.status(500).json({ error: error.message });
  }
};
