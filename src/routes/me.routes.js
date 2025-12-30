import express from "express";
import { enrollementsController } from "../controllers/me.controller.js";

const router = express.Router();

router.get("/enrollments", enrollementsController);

export default router;
