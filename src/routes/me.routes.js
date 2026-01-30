import express from "express";
import {
  deleteAccountController,
  enrollementsController,
  updateProfileController,
} from "../controllers/me.controller.js";
import { body } from "express-validator";

const router = express.Router();

router.get("/enrollments", enrollementsController);
router
  .route("/profile")
  .patch(
    [
      body("firstname")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Firstname must be at least 3 characters"),
      body("lastname")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Lastname must be at least 3 characters"),
      body("email").optional().isEmail().withMessage("Invalid email address"),
      body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 characters long"),
    ],
    updateProfileController,
  )
  .delete(deleteAccountController);

export default router;
