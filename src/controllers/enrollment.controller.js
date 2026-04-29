import Enrollment from "../models/course/Enrollment.model.js";
import { getCourse } from "../services/course/getCourse.service.js";

export const getEnrollemntsController = async (req, res) => {
  const student = req.user;

  console.log(student);

  const enrollments = await Enrollment.find({ student: student._id }).lean();

  if (!enrollments) return res.status(200).json({ success: true, courses: [] });

  const courses = await Promise.all(
    enrollments?.map(async (item) => await getCourse(item.course)),
  );

  console.log(courses);

  return res.status(200).json({ success: true, courses });
};
