import { validationResult } from "express-validator";
import Blacklist from "../models/Blacklist.model.js";
import { createInstructor } from "../services/instructor.service.js";
import User from "../models/Users.models.js";
import { createStudent } from "../services/student.service.js";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, role, gender, imageUrl } = req.body;

  const isUserExists = await User.findOne({ email: email });
  if (isUserExists) {
    if (isUserExists?.role === "student" && req.body?.vehicle) {
      return res.status(400).json({
        message:
          "User account exists, Please login for create a instructor account",
        navigate: "/login",
      });
    } else if (isUserExists?.role === "student" && !req.body?.vehicle) {
      return res.status(400).json({
        message: "User already exists",
        navigate: "/login",
      });
    } else {
      return res.status(400).json({
        message: "Instructor already exists",
        navigate: "/instructor/login",
      });
    }
  }

  try {
    if (req.body?.role === "instructor") {
      const instructor = await createInstructor({
        fullname,
        email,
        password,
        role,
      });

      const token = instructor.generateAuthToken();
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 86400 * 7,
      });
      return res.status(201).json({
        fullname,
        email,
        role,
      });
    } else if (req.body?.role === "student") {
      const student = await createStudent({
        fullname,
        email,
        password,
        role,
        gender,
        imageUrl,
      });

      const token = student.generateAuthToken();
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 86400 * 7,
      });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      return res.status(200).json({
        success: true,
        message: "Account creation successfull",
      });
    }
  } catch (error) {
    // MongoDB UNIQUE items error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: `Server Error : ${error.message}`,
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (user.role !== role) {
    return res.status(401).json({
      message: "Invalid email or password -> role mismatched",
      navigate: `${
        user.role === "instructor" ? "/instructor/login" : "/login"
      }`,
    });
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return res.status(401).json({ message: "Invalid email or password" });
  } else {
    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 86400 * 7,
    });

    return res.status(200).json({
      success: true,
      message: "Login successfull",
    });
  }
};

export const getProfileController = (req, res) => {
  return res.status(200).json({ message: "welcome!", ...req.user });
};

export const logoutController = async (req, res) => {
  res.clearCookie("token");
  const token =
    req.cookies.token || req.headers.authorization.replace("Bearer ", "");
  await Blacklist.create({ token: token });
  res.status(200).json({ message: "Logout done" });
};
