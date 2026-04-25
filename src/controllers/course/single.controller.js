import { getCourse } from "../../services/course/getCourse.service.js";

const getSingleCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await getCourse(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getSingleCourse;
