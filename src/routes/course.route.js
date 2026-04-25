import express from "express";
import {
  getCourseController,
  addCoursesController,
  getInstructorCoursesController,
  getEnrollmentsController,
  getDashboardDataController,
} from "../controllers/course/course.controller.js";
import { isInstructor } from "../middlewares/guard.middleware.js";
import multer from "multer";
import { body } from "express-validator";
import { parseCourseContent } from "../middlewares/parseCourseContent.middleware.js";
import getSingleCourseController from "../controllers/course/single.controller.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/get/:id", getSingleCourseController);

router.get("/get", getCourseController);

router.post(
  "/create",
  upload.single("courseThumbnail"),
  parseCourseContent,
  [
    body("courseTitle")
      .trim()
      .notEmpty()
      .withMessage("course title is required"),

    body("courseDescription")
      .trim()
      .notEmpty()
      .withMessage("course description is required"),

    body("coursePrice")
      .isNumeric()
      .isFloat({ gt: 0 })
      .withMessage("course price must be a positive number"),

    body("discount")
      .isNumeric()
      .isFloat({ min: 0, max: 100 })
      .withMessage("discount must be a number between 0 and 100"),

    body("courseContent")
      .isArray({ min: 1 })
      .withMessage("Must add at least one chapter"),

    body("courseContent.*.chapterTitle")
      .notEmpty()
      .withMessage("Chapter title is required"),

    body("courseContent.*.chapterContent")
      .isArray({ min: 1 })
      .withMessage("Each chapter must contain at least one lecture"),
  ],

  isInstructor,

  addCoursesController,
);

router.get(
  "/get-instructor-courses",
  isInstructor,
  getInstructorCoursesController,
);

router.get("/get-enrollments", isInstructor, getEnrollmentsController);

router.get("/dashboard", isInstructor, getDashboardDataController);

export default router;
