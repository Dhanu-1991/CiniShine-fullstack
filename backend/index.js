// Handle uncaught exceptions globally
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRouter from "./routes/authRoutes/authRouter.js";
import errorHandlingMiddleware from "./middlewares/errorHandlingMiddleware.js";
import router from "./routes/paymentRoutes/cashfree.js";

// Load environment variables
dotenv.config();

const app = express();

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://cini-shine-fullstack-hru4-git-main-dhanu-1991s-projects.vercel.app"
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: false // Set to true only if using cookies
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/v1/payments", router);
app.use("/api/v1/auth/authRoutes", authRouter);

// Global error handler
app.use(errorHandlingMiddleware);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
