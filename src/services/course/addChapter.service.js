import Chapter from "../../models/course/Chapter.model.js";
import Course from "../../models/course/Course.model.js";

export const addChapter = async (chaptersPayload, courseId, session) => {
  const chapters = chaptersPayload.map((chapter, index) => ({
    chapterTitle: chapter.chapterTitle,
    chapterOrder: index + 1,
    courseId,
  }));

  const createdChapters = await Chapter.insertMany(chapters, { session });
  return createdChapters;
};
