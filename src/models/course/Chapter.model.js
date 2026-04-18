import mongoose from "mongoose";

/* ---------- Chapter Schema ---------- */
const chapterSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  chapterOrder: {
    type: Number,
    required: true,
  },
  chapterTitle: {
    type: String,
    required: true,
    trim: true,
  },
});

const Chapter = mongoose.model("Chapter", chapterSchema);

export default Chapter;
