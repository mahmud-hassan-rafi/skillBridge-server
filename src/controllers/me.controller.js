import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/Users.models.js";
import { validationResult } from "express-validator";

// enrolled courses
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

// update profile controller (fullname, email, password)
export const updateProfileController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const user = req.user;
  const userData = req.body;
  const updates = {};

  // add changes in the updates obj
  // update firstname
  if (userData?.firstname && user.fullname?.firstname !== userData?.firstname) {
    updates["fullname.firstname"] = userData?.firstname;
  }
  // update lastname
  if (userData?.lastname && user.fullname?.lastname !== userData?.lastname) {
    updates["fullname.lastname"] = userData?.lastname;
  }

  // update email
  if (userData?.email && user.email !== userData.email) {
    updates["email"] = userData?.email;
  }

  // update password
  if (userData?.oldPassword && userData?.newPassword) {
    const { password: userOldPassword } = await User.findById(user._id).select(
      "+password",
    );
    const isPasswordMatched = await bcrypt.compare(
      userData?.oldPassword,
      userOldPassword,
    );

    if (isPasswordMatched) {
      if (userData?.oldPassword === userData?.newPassword) {
        return res.status(400).json({ success: false, message: "No changes" });
      }

      const newPasswordHash = await bcrypt.hash(userData?.newPassword, 10);
      updates["password"] = newPasswordHash;

      await User.findByIdAndUpdate(
        user._id,
        {
          $set: updates,
        },
        { new: true, runValidators: true },
      ).select("+password");

      return res
        .status(200)
        .json({ success: true, message: "successfully updated" });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "password not matched" });
    }
  }

  // checking for - does the data is same as previous?
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ success: false, message: "No changes" });
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: updates,
    },
    { new: true, runValidators: true },
  );

  res.status(200).json({ success: true, message: "successfully updated" });
};

// delete account controller
export const deleteAccountController = async (req, res) => {
  const user = req.user;

  await User.findByIdAndUpdate(
    user._id,
    {
      isDeleted: true,
    },
    { new: true },
  );

  res.json({ success: true, message: "Account deletion successfull" });
};
