import jwt from "jsonwebtoken";
import BlacklistModel from "../models/Blacklist.model.js";
import User from "../models/Users.models.js";

export const isAuthenticatedMiddlewares = async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await BlacklistModel.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const isUserExists = await User.findById(decoded._id).lean();

  if (!isUserExists) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = isUserExists;
  next();
};
