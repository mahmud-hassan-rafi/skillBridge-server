import Course from "../../models/course/Course.model.js";
import { Enrollment } from "../../models/course/Enrollment.model.js";

export const instructorEnrollmentList = async (
  educator,
  limit = 12,
  skip = 0,
) => {
  const instructorCourses = await Course.find({ educator }).lean();

  const courseIds = instructorCourses.map((course) => course._id);

  if (!instructorCourses)
    throw new Error("instructor hasn't added any course yet");

  const enrollmentList = await Enrollment.find({
    course: { $in: courseIds },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate({
      path: "course",
      select: "courseTitle coursePrice discount",
    })
    .populate({
      path: "student",
      select: "fullname imageUrl",
    })
    .lean();

  if (!enrollmentList.length) throw new Error("No enrollment yet");

  return enrollmentList;
};
