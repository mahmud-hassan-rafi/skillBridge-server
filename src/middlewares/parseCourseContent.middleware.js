export const parseCourseContent = (req, res, next) => {
  if (req.body.courseContent && typeof req.body.courseContent === "string") {
    try {
      req.body.courseContent = JSON.parse(req.body.courseContent);
    } catch (error) {
      return res.status(400).json({
        message: "Invalid JSON format for courseContent",
      });
    }
  }
  next();
};
