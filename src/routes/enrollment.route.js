import express from "express";
import {
  getEnrollemntsController,
  isEnrolledTheCourseController,
} from "../controllers/enrollment.controller.js";
import { isAuthenticatedMiddlewares } from "../middlewares/Auth.middleware.js";

const router = express.Router();

router.get(
  "/my-enrollments",
  isAuthenticatedMiddlewares,
  getEnrollemntsController,
);

router.get(
  "/is-enrolled/:courseId",
  isAuthenticatedMiddlewares,
  isEnrolledTheCourseController,
);

export default router;
