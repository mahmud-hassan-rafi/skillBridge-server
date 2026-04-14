import Chapter from "../../models/course/Chapter.model.js";
import Course from "../../models/course/Course.model.js";
import Lecture from "../../models/course/Lectures.model.js";

export const getCourse = async (courseId) => {
  const course = await Course.findById(courseId).lean();
  if (!course) return null;

  const chapters = await Chapter.find({ courseId: course._id }).lean();
  const chapterIds = chapters.map((ch) => ch._id);

  const lectures = await Lecture.find({
    chapterId: { $in: chapterIds },
  }).lean();

  // Group lectures by chapterId
  const lectureMap = {};
  lectures.forEach((lecture) => {
    if (!lectureMap[lecture.chapterId]) {
      lectureMap[lecture.chapterId] = [];
    }
    lectureMap[lecture.chapterId].push(lecture);
  });

  const chapterContent = chapters.map((chapter) => ({
    ...chapter,
    chapterContent: lectureMap[chapter._id] || [],
  }));

  return {
    ...course,
    chapterContent,
  };
};
