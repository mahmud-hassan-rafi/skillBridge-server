import Course from "../../models/course/Course.model.js";
import { instructorEnrollmentList } from "./enrollmentList.service.js";

export default async function getDashbaordData(educator) {
  const enrollments = await instructorEnrollmentList(educator);
  const totalCourse = await Course.find({ educator }).countDocuments();

  return { latestEnrollments: enrollments, totalCourse };
}
