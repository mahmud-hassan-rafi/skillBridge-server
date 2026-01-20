import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import meRouter from "./routes/me.routes.js";
import connectCloudinary from "./config/cloudinary.js";
dotenv.config();

const app = express();

// connect to database
app.use(async (req, res, next) => {
  await connectToDB();
  await connectCloudinary();
  next();
});

// middlewares
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Hello, World! It's working.");
});

app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);

export default app;
