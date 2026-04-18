import Lecture from "../../models/course/Lectures.model.js";

export const addLecture = async (chaptersPayload, chapters, session) => {
  const lectures = chaptersPayload.flatMap((chapter, chapterIndex) =>
    chapter.chapterContent.map((lecture, lectureIndex) => ({
      lectureTitle: lecture?.lectureTitle,
      lectureDuration: lecture?.lectureDuration,
      lectureUrl: lecture?.lectureUrl,
      lectureOrder: lectureIndex + 1,
      chapterId: chapters[chapterIndex]._id,
    })),
  );

  if (lectures.length === 0) return null;

  const createdLectures = await Lecture.insertMany(lectures, { session });
  return createdLectures;
};
