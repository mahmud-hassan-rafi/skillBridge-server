import express from "express";
import { body } from "express-validator";
import {
  getProfileController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controller.js";
import { isAuthenticatedMiddlewares } from "../middlewares/Auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 3 characters"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  registerController
);
router.post("/login", loginController);
router.get("/me", isAuthenticatedMiddlewares, getProfileController);
router.post("/logout", isAuthenticatedMiddlewares, logoutController);

export default router;
