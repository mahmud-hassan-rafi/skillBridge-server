import User from "../models/Users.models.js";

export const createStudent = async ({
  fullname,
  email,
  password,
  role,
  gender,
  imageUrl,
}) => {
  if (!fullname.firstname || !email || !password || !role) {
    throw new Error("All fields are required");
  } else {
    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
      gender,
      imageUrl,
    });
    return user;
  }
};
