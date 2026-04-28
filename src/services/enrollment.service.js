import { Enrollment } from "../models/course/Enrollment.model.js";

/**
 * Create enrollment for a student in a course
 * @param {string} studentId - MongoDB User ID
 * @param {string} courseId - MongoDB Course ID
 * @param {string} paymentId - Stripe Payment Intent ID (for reference)
 * @returns {Object} Enrollment document
 */
export const createEnrollmentService = async (
  studentId,
  courseId,
  paymentId,
) => {
  try {
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      console.log(
        "Student already enrolled in this course:",
        existingEnrollment._id,
      );
      return existingEnrollment;
    }

    // Create new enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      progress: 0,
    });

    console.log("New enrollment created:", enrollment._id);
    console.log("Student:", studentId);
    console.log("Course:", courseId);
    console.log("Payment ID:", paymentId);

    return enrollment;
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - already enrolled
      console.log(
        "⚠️ Student already enrolled in this course (caught from DB)",
      );
      return await Enrollment.findOne({
        student: studentId,
        course: courseId,
      });
    }
    throw error;
  }
};

/**
 * Cancel enrollment (for refunds)
 * @param {string} studentId - MongoDB User ID
 * @param {string} courseId - MongoDB Course ID
 */
export const cancelEnrollmentService = async (studentId, courseId) => {
  try {
    const result = await Enrollment.deleteOne({
      student: studentId,
      course: courseId,
    });

    if (result.deletedCount > 0) {
      console.log("✅ Enrollment cancelled");
    } else {
      console.log("⚠️ No enrollment found to cancel");
    }

    return result;
  } catch (error) {
    console.error("❌ Error cancelling enrollment:", error);
    throw error;
  }
};
