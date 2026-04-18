import User from "../models/Users.models.js";
import jwt from "jsonwebtoken";

export const isInstructor = async (req, res, next) => {
  const token = req.cookies.token;

  const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodeToken._id);

  // if no user or user role not matched to the instructor then return
  if (!user || user.role !== "instructor") {
    return res.status(401).json({ success: false, message: "unauthorized!" });
  }

  req.instructor = user;
  next();
};
