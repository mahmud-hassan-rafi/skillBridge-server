import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
dotenv.config();

const app = express();
connectToDB();

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

export default app;
