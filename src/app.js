import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import meRouter from "./routes/me.routes.js";
import { isAuthenticatedMiddlewares } from "./middlewares/Auth.middleware.js";
import paymentRouter from "./routes/payment.route.js";
import courseRouter from "./routes/course.route.js";
import { sendEmail } from "./utils/sendEmail.js";

const app = express();

// middlewares
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.FRONTEND_URL,
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  res.send("Hello, World! API is working 🎉");
});

app.use(
  "/api/auth",
  express.json(),
  async (req, res, next) => {
    await connectToDB();
    next();
  },
  authRouter,
);

app.use(
  "/api/me",
  express.json(),
  async (req, res, next) => {
    await connectToDB();
    next();
  },
  isAuthenticatedMiddlewares,
  meRouter,
);

app.use(
  "/api/courses",
  express.json(),
  async (req, res, next) => {
    await connectToDB();
    next();
  },
  courseRouter,
);

// ⚠️ Stripe payment router (webhook with raw body is handled in the router)
app.use("/api/stripe", paymentRouter);

export default app;
