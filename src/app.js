import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import meRouter from "./routes/me.routes.js";
import connectCloudinary from "./config/cloudinary.js";
import { isAuthenticatedMiddlewares } from "./middlewares/Auth.middleware.js";
dotenv.config();

const app = express();

// connect to cloudinary
await connectCloudinary();

// middlewares
const corsOptions = {
  origin: ["http://localhost:5173", "https://skillbridge-orcin.vercel.app"],
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

app.use(
  "/api/auth",
  async (req, res, next) => {
    await connectToDB();
    next();
  },
  authRouter,
);

app.use(
  "/api/me",
  async (req, res, next) => {
    await connectToDB();
    next();
  },
  isAuthenticatedMiddlewares,
  meRouter,
);

export default app;
