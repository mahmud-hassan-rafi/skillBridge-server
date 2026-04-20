import Course from "../../models/course/Course.model.js";
import { addChapter } from "../../services/course/addChapter.service.js";
import { addCourse } from "../../services/course/addCourse.service.js";
import mongoose from "mongoose";
import { addLecture } from "../../services/course/addLecture.service.js";
import { validationResult } from "express-validator";
import { getInstructorCourses } from "../../services/course/getInstuctorCourses.service.js";
import { instructorEnrollmentList } from "../../services/course/enrollmentList.service.js";
import cloudinary from "../../config/cloudinary.js";
import getDashbaordData from "../../services/course/getDashboardData.service.js";
import { getCourse } from "../../services/course/getCourse.service.js";

export const addCoursesController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const instructor = req.instructor;
  const thumbnailBuffer = req.file;
  let uploadedImage = {};

  const courseExists = await Course.findOne({
    courseTitle: req.body.courseTitle,
    educator: instructor._id,
  }).lean();

  if (courseExists) {
    return res.status(400).json({
      success: false,
      message: "course with same title already exists",
    });
  }

  const chaptersPayload = req.body.courseContent.map((chapter) => chapter);

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const course = await addCourse(
        req.body,
        thumbnailBuffer,
        uploadedImage,
        instructor._id,
        session,
      );

      const chapters = await addChapter(chaptersPayload, course._id, session);
      const lectures = await addLecture(chaptersPayload, chapters, session);

      const isCreated = await Course.findById(course._id)
        .populate({
          path: "educator",
          select: "fullname email",
        })
        .session(session)
        .lean();
      return res.status(201).json({
        success: true,
        message: "course creation successful",
        course: { ...isCreated },
        chapters: [...chapters],
        lectures: [...lectures],
      });
    });
    session.endSession();
  } catch (error) {
    session.endSession();
    console.log(error);
    if (uploadedImage?.public_id) {
      cloudinary.uploader.destroy(uploadedImage.public_id);
    }
    return res.status(500).json({
      success: false,
      message: "error occurred while creating course",
    });
  }
};

export const getCourseController = async (req, res) => {
  const { limit, skip } = req.query;

  const courses = await Course.find({})
    .sort({ createdAt: -1 })
    .limit(limit || 12)
    .skip(skip || 0)
    .lean();

  const AllCourses = await Promise.all(
    courses.map(async (course) => await getCourse(course._id)),
  );

  return res.status(200).json({ success: true, AllCourses });
};

export const getInstructorCoursesController = async (req, res) => {
  const instructor = req.instructor;
  if (!instructor)
    return res
      .status(403)
      .json({ success: false, message: "be an instructor first" });

  try {
    const instructorCourses = await getInstructorCourses(instructor._id);

    return res
      .status(200)
      .json({ success: true, courses: [...instructorCourses] });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error?.data?.message || error?.message || error,
    });
  }
};

export const getEnrollmentsController = async (req, res) => {
  const instructor = req.instructor;
  if (!instructor)
    return res
      .status(401)
      .json({ success: false, message: "only for instructor" });

  try {
    const enrollments = await instructorEnrollmentList(instructor._id);

    return res.status(200).json({ success: true, enrollments });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error });
  }
};

export const getDashboardDataController = async (req, res) => {
  const instructor = req.instructor;

  try {
    const dashboardData = await getDashbaordData(instructor._id);

    return res.status(200).json({ success: true, dashboard: dashboardData });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
