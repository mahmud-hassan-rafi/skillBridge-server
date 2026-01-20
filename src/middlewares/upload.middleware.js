import multer from "multer";

const storage = multer.memoryStorage();
// ⬆⬆⬆ File RAM ee store korbe. js garbage collector ekhane manually
//   remove kora lagbe na file. automatic delete hoy jabe

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("only image allowed"));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter,
});
