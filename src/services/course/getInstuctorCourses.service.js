import Course from "../../models/course/Course.model.js";
import Enrollment from "../../models/course/Enrollment.model.js";

export const getInstructorCourses = async (educator, limit = 12, skip = 0) => {
  const instructorCourses = await Course.find({ educator })
    .lean()
    .limit(limit)
    .skip(skip);
  if (instructorCourses.length === 0) throw new Error("no course added yet");

  const res = await Promise.all(
    instructorCourses.map(async (course) => {
      const enroll = await Enrollment.find({ course: course._id });

      if (!enroll) return null;

      const earnings = Number(
        (
          (course.coursePrice -
            course.coursePrice * Number((course.discount / 100).toFixed(2))) *
          enroll.length
        ).toFixed(2),
      );

      return {
        _id: course._id,
        courseTitle: course.courseTitle,
        courseThumbnail: structuredClone(course.courseThumbnail),
        createdAt: course.createdAt,
        enrollments: enroll.length,
        earnings,
      };
    }),
  );

  return res;
};
