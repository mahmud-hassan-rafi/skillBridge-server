import mongoose from "mongoose";

const LecturesSchema = new mongoose.Schema({
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    required: true,
  },
  lectureTitle: {
    type: String,
    required: true,
    trim: true,
  },
  lectureDuration: {
    type: Number,
    required: true,
  },
  lectureUrl: {
    type: String,
    required: true,
  },
  lectureOrder: {
    type: Number,
    required: true,
  },
  isPreviewFree: {
    type: Boolean,
    default: false,
  },
});

const Lecture = mongoose.model("Lecture", LecturesSchema);

export default Lecture;
