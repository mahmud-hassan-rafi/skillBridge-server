import { validationResult } from "express-validator";
import Blacklist from "../models/Blacklist.model.js";
import User from "../models/Users.models.js";
import { createStudent } from "../services/student.service.js";

const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL;

export const registerController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, role, gender, imageUrl } = req.body;

  const isUserExists = await User.findOne({ email: email });
  if (isUserExists) {
    /* 
      এখানে আমরা চেক করছি যে যদি ইউজারটি ইন্সট্রাক্টর হিসেবে রেজিস্টার করতে চায় 
      কিন্তু স্টুডেন্ট হিসেবে রেজিস্টার করা আছে, তাহলে তাকে স্টুডেন্ট লগইন পেজে নিয়ে
      যাওয়া হবে। এবং যদি ইউজারটি স্টুডেন্ট হিসেবে রেজিস্টার করতে চায় কিন্তু ইন্সট্রাক্টর
       হিসেবে রেজিস্টার করা আছে, তাহলে তাকে ইন্সট্রাক্টর লগইন পেজে নিয়ে যাওয়া হবে।
    */
    if (isUserExists?.role === "student" && req.body?.role === "instructor") {
      return res.status(400).json({
        message:
          "User account exists, Please login for create a instructor account",
        navigate: "/login",
      });
    } else if (
      /*
      এখানে আমরা চেক করছি যে যদি ইউজারটি স্টুডেন্ট হিসেবে রেজিস্টার করতে চায় 
      কিন্তু ইন্সট্রাক্টর হিসেবে রেজিস্টার করা আছে, তাহলে তাকে ইন্সট্রাক্টর লগইন পেজে 
      নিয়ে যাওয়া হবে। এবং যদি ইউজারটি ইন্সট্রাক্টর হিসেবে রেজিস্টার করতে চায় কিন্তু 
      স্টুডেন্ট হিসেবে রেজিস্টার করা আছে, তাহলে তাকে স্টুডেন্ট লগইন পেজে নিয়ে যাওয়া হবে।
    */
      isUserExists?.role === "student" &&
      req.body?.role === "student"
    ) {
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
      secure: isProd, // prod এ true
      sameSite: isProd ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Account creation successfull",
    });
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

// login controller
export const loginController = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      const token = user.generateAuthToken();
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 86400 * 7,
        secure: isProd, // prod এ true
        sameSite: isProd ? "none" : "lax",
        path: "/",
      });

      return res.status(200).json({
        success: true,
        message: "Login successfull",
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get profile controller
export const getProfileController = (req, res) => {
  return res.status(200).json({ message: "welcome!", ...req.user });
};

// Logout controller
export const logoutController = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
  const token =
    req.cookies.token || req.headers.authorization.replace("Bearer ", "");
  await Blacklist.create({ token: token });
  res.status(200).json({ message: "Logout done" });
};
