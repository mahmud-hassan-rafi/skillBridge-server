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
    "https://skillbridge-orcin.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Hello, World! API is working 🎉");
});

app.get("/test-email", async (req, res) => {
  await sendEmail(
    "amaricancitizen8@gmail.com",
    "Test Mail",
    "<h1>Email working</h1>",
  );

  res.send("Email sent");
});

app.post(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  (req, res) => {
    console.log("WEBHOOK HIT");

    res.status(200).send("Webhook received");
  },
);

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

app.use(
  "/api/courses",
  async (req, res, next) => {
    await connectToDB();
    next();
  },
  courseRouter,
);

app.use("/api/stripe", paymentRouter);

export default app;
