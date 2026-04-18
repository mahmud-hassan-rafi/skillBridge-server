import cloudinary from "../../config/cloudinary.js";
import Course from "../../models/course/Course.model.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";

export const addCourse = async (
  reqBody,
  thumbnailBuffer,
  uploadedImage,
  instructorId,
  session,
) => {
  try {
    const cloudinaryRes = await uploadToCloudinary(
      thumbnailBuffer,
      "courses/thumbnail",
    );
    uploadedImage = {
      url: cloudinaryRes?.url,
      public_id: cloudinaryRes?.public_id,
    };
  } catch (error) {
    console.log(error);
  }

  const courseData = {
    courseTitle: reqBody.courseTitle,
    courseDescription: reqBody.courseDescription,
    coursePrice: reqBody.coursePrice,
    discount: reqBody.discount,
    isPublished: reqBody?.isPublished,
    courseThumbnail: structuredClone(uploadedImage),
  };

  try {
    const [res] = await Course.create(
      [
        {
          ...courseData,
          educator: instructorId,
        },
      ],
      { session },
    );

    return res;
  } catch (error) {
    console.log(error);
    if (uploadedImage?.public_id) {
      cloudinary.uploader.destroy(uploadedImage.public_id);
      console.log("deleted the file again");
    }
  }
};
