import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(`${process.env.MONGO_URI}/skillbridge`);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDB;
