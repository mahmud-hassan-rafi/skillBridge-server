import jwt, { decode } from "jsonwebtoken";
import User from "../models/Users.models.js";

export const enrollementsController = async (req, res) => {
  const { token } = req.cookies;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded._id);
  if (!user) {
    return res
      .status(404)
      .json({ message: "Login to see enrollments", navigate: "/login" });
  }
  return res.json({
    message: "success",
    enrolledCourses: user?.enrolledCourses,
  });
};
