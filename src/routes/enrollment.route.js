import express from "express";
import { getEnrollemntsController } from "../controllers/enrollment.controller.js";
import { isAuthenticatedMiddlewares } from "../middlewares/Auth.middleware.js";

const router = express.Router();

router.get(
  "/my-enrollments",
  isAuthenticatedMiddlewares,
  getEnrollemntsController,
);

export default router;
